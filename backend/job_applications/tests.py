from datetime import date
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from job_applications.models import JobApplication, Attachment
from django.core.files.uploadedfile import SimpleUploadedFile

User = get_user_model()


class JobApplicationAPITestCase(APITestCase):
    def setUp(self):
        # 🧪 Mock S3 so tests don’t touch AWS
        self.s3_patcher = patch("job_applications.views.get_s3_client")
        self.mock_s3 = self.s3_patcher.start()
        self.mock_s3.return_value = MagicMock(
            upload_fileobj=MagicMock(return_value=None),
            delete_object=MagicMock(return_value=None),
            delete_objects=MagicMock(return_value=None),
        )
        self.addCleanup(self.s3_patcher.stop)

        # 🧑‍💻 Create test user and authenticate
        self.user = User.objects.create_user(
            email="josh@example.com", password="testpass123"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # 📦 Create sample job application
        self.job = JobApplication.objects.create(
            user=self.user,
            company="Google",
            position="SWE",
            status="applied",
            date_applied=date.today(),
        )

        self.list_url = reverse("job_application_list_create")
        self.detail_url = reverse("job_application_detail", args=[self.job.id])

    def test_list_job_applications(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)

    def test_search_filter_job_applications(self):
        JobApplication.objects.create(
            user=self.user,
            company="Meta",
            position="Developer",
            status="applied",
            date_applied=date.today(),
        )
        response = self.client.get(self.list_url, {"search": "meta"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            any("Meta" in job["company"] for job in response.data["results"])
        )

    def test_create_job_application_with_attachment(self):
        file = SimpleUploadedFile(
            "resume.pdf", b"PDF content", content_type="application/pdf"
        )
        data = {
            "company": "Amazon",
            "position": "DevOps Intern",
            "status": "applied",
            "date_applied": str(date.today()),
            "attachments": [file],
        }
        response = self.client.post(self.list_url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 2)
        self.assertEqual(Attachment.objects.count(), 1)

    def test_get_job_application_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["company"], "Google")

    def test_update_job_application(self):
        data = {
            "position": "Backend Engineer",
            "date_applied": str(date.today()),
        }
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.position, "Backend Engineer")

    def test_delete_job_application(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(JobApplication.objects.filter(id=self.job.id).exists())
