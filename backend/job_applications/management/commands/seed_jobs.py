# job_applications/management/commands/seed_jobs.py

import random
from django.core.management.base import BaseCommand
from faker import Faker
from accounts.models import CustomUser
from job_applications.models import JobApplication

fake = Faker()

STATUSES = ["saved", "applied", "interview", "offer", "rejected"]
COMPANIES = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Facebook",
    "Tesla",
    "Netflix",
    "Adobe",
    "Airbnb",
    "Twitter",
    "Oracle",
    "IBM",
    "Salesforce",
    "Stripe",
    "Shopify",
    "Uber",
    "Lyft",
    "Reddit",
    "Dropbox",
    "Snapchat",
    "Spotify",
    "TikTok",
    "Nvidia",
    "Intel",
    "AMD",
    "LinkedIn",
    "Cisco",
    "Pinterest",
    "Palantir",
    "DoorDash",
    "Robinhood",
    "Square",
    "Atlassian",
    "Coinbase",
    "Zoom",
    "Slack",
    "Twilio",
    "Asana",
    "Instacart",
]


positions = [
    "Software Engineer",
    "Frontend Engineer",
    "Frontend Developer",
    "Devops Engineer",
    "Data Scientist",
    "Data Engineer",
    "Backend Engineer",
    "Backend Developer",
    "Fullstack Engineer",
    "Fullstack Developer",
    "UX Designer",
    "UI Designer",
    "Kubernetes Engineer",
    "Solutions Architect",
    "Cloud Engineer",
    "Network Engineer",
    "DevSecOps Engineer",
    "Security Engineer",
    "Cybersecurity Engineer",
    "Cybersecurity Analyst",
    "Penetration Tester",
]


class Command(BaseCommand):
    help = "Seed 100 JobApplications for a specific user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            help="Email of the user to seed job applications for",
            required=True,
        )

    def handle(self, *args, **options):
        email = options["email"]
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"User with email {email} does not exist.")
            )
            return

        jobs = []
        for _ in range(1000):
            company = random.choice(COMPANIES)
            position = random.choice(positions)
            location = fake.city()
            status = random.choice(STATUSES)
            date_applied = fake.date_between(start_date="-90d", end_date="today")
            notes = fake.paragraph(nb_sentences=3)
            salary = f"${random.randint(50, 200)}k"
            contact_person = fake.name()
            contact_email = fake.email()
            url = fake.url()

            job = JobApplication(
                user=user,
                company=company,
                position=position,
                location=location,
                status=status,
                date_applied=date_applied,
                notes=notes,
                salary=salary,
                contact_person=contact_person,
                contact_email=contact_email,
                url=url,
            )
            jobs.append(job)

        JobApplication.objects.bulk_create(jobs)

        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Successfully created {len(jobs)} Job Applications for {user.email}."
            )
        )
