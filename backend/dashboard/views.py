# app/job_applications/views.py

from collections import defaultdict
from django.db.models import Count, Q, Case, When, Value, F, CharField
from django.db.models.functions import TruncMonth
from django.db.models.expressions import Func
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from job_applications.models import JobApplication

from .serializers import DashboardSerializer, RecentJobSerializer


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = JobApplication.objects.filter(user=request.user)

        # 1) Summary metrics via a single aggregate()
        metrics = qs.aggregate(
            total=Count("id"),
            interview=Count("id", filter=Q(status="interview")),
            offer=Count("id", filter=Q(status="offer")),
            rejected=Count("id", filter=Q(status="rejected")),
            active=Count("id", filter=Q(status__in=["applied", "interview"])),
            responses=Count("id", filter=~Q(status__in=["saved", "applied"])),
        )
        total = metrics["total"]
        interview_count = metrics["interview"]
        offer_count = metrics["offer"]
        rejection_count = metrics["rejected"]
        active_count = metrics["active"]
        responses = metrics["responses"]

        response_rate = (responses / total * 100) if total else 0
        responded = interview_count + offer_count + rejection_count
        success_rate = (offer_count / responded * 100) if responded else 0

        # 2) Status distribution (PieChart)
        status_qs = qs.values("status").annotate(count=Count("id"))
        status_map = {s["status"]: s["count"] for s in status_qs}
        status_order = ["saved", "applied", "interview", "offer", "rejected"]
        status_data = [
            {"name": s.capitalize(), "value": status_map.get(s, 0)}
            for s in status_order
        ]

        # 3) Timeline by month (LineChart)
        month_qs = (
            qs.annotate(month=TruncMonth("date_applied"))
            .values("month")
            .annotate(
                applications=Count("id"),
                interviews=Count("id", filter=Q(status="interview")),
                offers=Count("id", filter=Q(status="offer")),
            )
            .order_by("month")
        )
        timeline_data = [
            {
                "month": entry["month"].strftime("%b"),
                "applications": entry["applications"],
                "interviews": entry["interviews"],
                "offers": entry["offers"],
            }
            for entry in month_qs
        ]

        # 4) Response‑rate bar metrics
        response_rate_data = [
            {"name": "Response Rate", "value": round(response_rate, 1)},
            {
                "name": "Interview Rate",
                "value": round(responded / responses * 100, 1) if responses else 0,
            },
            {
                "name": "Offer Rate",
                "value": round(offer_count / responded * 100, 1) if responded else 0,
            },
        ]

        # 5) Top locations (vertical BarChart)
        loc_annotation = Case(
            When(location__icontains="remote", then=Value("Remote")),
            When(
                ~Q(location=""),
                then=Func(
                    F("location"), Value(r",.*$"), Value(""), function="regexp_replace"
                ),
            ),
            default=Value("Unknown"),
            output_field=CharField(),
        )
        loc_qs = (
            qs.annotate(loc=loc_annotation)
            .values("loc")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        location_data = [
            {"name": entry["loc"], "value": entry["count"]} for entry in loc_qs
        ]

        # 6) Top companies (vertical BarChart)
        comp_qs = (
            qs.values("company").annotate(count=Count("id")).order_by("-count")[:5]
        )
        company_data = [
            {"name": entry["company"], "value": entry["count"]} for entry in comp_qs
        ]

        # 7) Time‑to‑response buckets (simulated)
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

        # 8) Recent 5 applications
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
        return Response(serializer.data, status=200)
