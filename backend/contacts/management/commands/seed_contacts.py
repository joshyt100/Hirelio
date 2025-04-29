import random
from faker import Faker
from django.core.management.base import BaseCommand
from accounts.models import CustomUser
from contacts.models import Contact

fake = Faker()

RELATIONSHIPS = [
    "former-colleague",
    "current-colleague",
    "classmate",
    "friend",
    "mentor",
    "recruiter",
    "manager",
    "industry-contact",
    "other",
]

TAGS = [
    "tech",
    "finance",
    "startup",
    "networking",
    "follow-up",
    "urgent",
    "alumni",
    "conference",
    "linkedin",
    "email",
]


class Command(BaseCommand):
    help = "Seed 100 Contact records for a specific user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            type=str,
            help="Email of the user to seed contacts for",
            required=True,
        )

    def handle(self, *args, **options):
        email = options["email"]
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"❌ User with email {email} does not exist.")
            )
            return

        contacts = []
        for _ in range(100):
            contact = Contact(
                user=user,
                name=fake.name(),
                email=fake.email(),
                phone=fake.phone_number()[:20],
                company=fake.company(),
                position=fake.job(),
                relationship=random.choice(RELATIONSHIPS),
                notes=fake.paragraph(),
                last_contacted=fake.date_between(start_date="-60d", end_date="today"),
                next_follow_up=fake.date_between(start_date="today", end_date="+30d"),
                linkedin_url=fake.url(),
                twitter_url=fake.url(),
                is_favorite=random.choice([True, False]),
                tags=random.sample(TAGS, random.randint(1, 3)),
                avatar=fake.image_url(),
            )
            contacts.append(contact)

        Contact.objects.bulk_create(contacts)

        self.stdout.write(
            self.style.SUCCESS(f"✅ Created {len(contacts)} contacts for {user.email}")
        )
