# dashboard/serializers.py
from rest_framework import serializers
from job_applications.models import JobApplication


class RecentJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        # only the fields your UI shows in “Recent Applications”
        fields = [
            "id",
            "company",
            "position",
            "location",
            "status",
            "date_applied",
        ]


class DashboardSerializer(serializers.Serializer):
    # summary cards
    total_applications = serializers.IntegerField()
    active_applications = serializers.IntegerField()
    interview_count = serializers.IntegerField()
    offer_count = serializers.IntegerField()
    rejection_count = serializers.IntegerField()
    response_rate = serializers.FloatField()
    success_rate = serializers.FloatField()

    # charts
    status_data = serializers.ListField(child=serializers.DictField())
    timeline_data = serializers.ListField(child=serializers.DictField())
    response_rate_data = serializers.ListField(child=serializers.DictField())
    location_data = serializers.ListField(child=serializers.DictField())
    company_data = serializers.ListField(child=serializers.DictField())
    time_to_response_data = serializers.ListField(child=serializers.DictField())

    # recent list
    recent_applications = RecentJobSerializer(many=True)
