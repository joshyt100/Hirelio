from django.contrib import admin
from django.conf import settings
from django.contrib.auth.views import login_required
from django.http import HttpResponse
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    # url
    path("api/", include("accounts.urls")),
    path("api/job-applications/", include("job_applications.urls")),
    path("google/", include("social_django.urls", namespace="social")),
    path("cover/", include("AI_generator.urls")),
]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
