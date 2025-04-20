import re
from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from job_applications.models import JobApplication
from .serializers import DashboardSerializer, RecentJobSerializer


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = JobApplication.objects.filter(user=request.user)
        total = qs.count()

        # --- 1) summary metrics ---
        interview_count = qs.filter(status="interview").count()
        offer_count = qs.filter(status="offer").count()
        rejection_count = qs.filter(status="rejected").count()
        active_count = qs.filter(status__in=["applied", "interview"]).count()
        responses = qs.exclude(status__in=["saved", "applied"]).count()

        response_rate = (responses / total * 100) if total else 0
        success_rate = (
            ((offer_count / (interview_count + offer_count + rejection_count)) * 100)
            if (interview_count + offer_count + rejection_count)
            else 0
        )

        # --- 2) status distribution (PieChart) ---
        status_counts = {
            s: qs.filter(status=s).count()
            for s in ["saved", "applied", "interview", "offer", "rejected"]
        }
        status_data = [
            {"name": s.capitalize(), "value": status_counts[s]}
            for s in ["saved", "applied", "interview", "offer", "rejected"]
        ]

        # --- 3) timeline data by month (LineChart) ---
        month_names = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        monthly = defaultdict(
            lambda: {"month": None, "applications": 0, "interviews": 0, "offers": 0}
        )
        for job in qs:
            m = month_names[job.date_applied.month - 1]
            rec = monthly[m]
            rec["month"] = m
            rec["applications"] += 1
            if job.status == "interview":
                rec["interviews"] += 1
            if job.status == "offer":
                rec["offers"] += 1
        timeline_data = [
            monthly[m] for m in month_names if monthly[m]["applications"] > 0
        ]

        # --- 4) response rates bar data ---
        response_rate_data = [
            {"name": "Response Rate", "value": round(response_rate, 1)},
            {
                "name": "Interview Rate",
                "value": round(
                    (
                        (
                            (interview_count + offer_count + rejection_count)
                            / responses
                            * 100
                        )
                        if responses
                        else 0
                    ),
                    1,
                ),
            },
            {
                "name": "Offer Rate",
                "value": round(
                    (
                        (
                            offer_count
                            / (interview_count + offer_count + rejection_count)
                            * 100
                        )
                        if (interview_count + offer_count + rejection_count)
                        else 0
                    ),
                    1,
                ),
            },
        ]

        # --- 5) top locations (vertical BarChart) ---
        loc_map = defaultdict(int)
        for job in qs:
            loc = "Unknown"
            if job.location:
                low = job.location.lower()
                if "remote" in low:
                    loc = "Remote"
                else:
                    m = re.match(r"([A-Za-z\s]+),?\s*[A-Z]{2}", job.location)
                    loc = m.group(1).strip() if m else job.location.split(",")[0]
            loc_map[loc] += 1
        location_data = sorted(
            [{"name": k, "value": v} for k, v in loc_map.items()],
            key=lambda x: x["value"],
            reverse=True,
        )[:5]

        # --- 6) top companies (vertical BarChart) ---
        comp_map = defaultdict(int)
        for job in qs:
            comp_map[job.company] += 1
        company_data = sorted(
            [{"name": k, "value": v} for k, v in comp_map.items()],
            key=lambda x: x["value"],
            reverse=True,
        )[:5]

        # --- 7) time-to-response pie (simulated) ---
        # you can replace with real response-date logic later
        simulated_days = [3, 5, 7, 10, 14, 21, 28, 30]
        cat_map = defaultdict(int)
        for d in simulated_days:
            cat = (
                "< 1 week"
                if d <= 7
                else "1-2 weeks" if d <= 14 else "2-4 weeks" if d <= 30 else "> 4 weeks"
            )
            cat_map[cat] += 1
        time_to_response_data = [{"name": k, "value": v} for k, v in cat_map.items()]

        # --- 8) recent 5 applications ---
        recent_qs = qs.order_by("-date_applied")[:5]
        recent = RecentJobSerializer(recent_qs, many=True).data

        payload = {
            "total_applications": total,
            "active_applications": active_count,
            "interview_count": interview_count,
            "offer_count": offer_count,
            "rejection_count": rejection_count,
            "response_rate": round(response_rate, 1),
            "success_rate": round(success_rate, 1),
            "status_data": status_data,
            "timeline_data": timeline_data,
            "response_rate_data": response_rate_data,
            "location_data": location_data,
            "company_data": company_data,
            "time_to_response_data": time_to_response_data,
            "recent_applications": recent,
        }

        serializer = DashboardSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)
