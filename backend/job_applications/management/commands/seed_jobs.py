from django.core.management.base import BaseCommand
from job_applications.models import JobApplication, Attachment
from django.contrib.auth import get_user_model
from django.utils import timezone
import random
from datetime import timedelta


class Command(BaseCommand):
    help = "Seed the database with job applications and attachments"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        user = User.objects.first()

        if not user:
            self.stdout.write(
                self.style.ERROR("❌ No user found. Please create a user first.")
            )
            return

        companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix"]
        positions = [
            "Software Engineer",
            "Data Scientist",
            "Product Manager",
            "QA Engineer",
        ]
        statuses = ["applied", "interview", "rejected", "offer", "saved"]
        locations = ["Remote", "New York", "Seattle", "Austin", "San Francisco"]

        for i in range(20):
            job = JobApplication.objects.create(
                user=user,
                company=random.choice(companies),
                position=random.choice(positions),
                location=random.choice(locations),
                status=random.choice(statuses),
                date_applied=timezone.now().date()
                - timedelta(days=random.randint(1, 60)),
                notes="Test application notes",
                salary=f"${random.randint(70000, 150000)}",
                contact_person="John Doe",
                contact_email="johndoe@example.com",
                url="https://example.com/job",
            )

            for j in range(random.randint(1, 3)):
                Attachment.objects.create(
                    job_application=job,
                    name=f"Resume {j + 1}",
                    type="pdf",
                    file_url=f"s3://bucket/resume_{i}_{j}.pdf",
                )

        self.stdout.write(
            self.style.SUCCESS("✅ Seeded 20 job applications with attachments!")
        )
