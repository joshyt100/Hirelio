from django.core.management.base import BaseCommand
from job_applications.models import JobApplication


class Command(BaseCommand):
    help = "Delete the latest 30 job applications"

    def handle(self, *args, **kwargs):
        latest_jobs = JobApplication.objects.order_by("-date_applied")[:30]
        count = latest_jobs.count()

        if count == 0:
            self.stdout.write(
                self.style.WARNING("⚠️ No job applications found to delete.")
            )
            return

        for job in latest_jobs:
            job.delete()

        self.stdout.write(
            self.style.SUCCESS(f"🗑️ Deleted {count} latest job application(s).")
        )
