# cover_backend/urls.py
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from accounts.views import google_login_clean, google_debug_view  # ✅ new helper view
from accounts.views import social_auth_logout_then_complete

urlpatterns = [
    # ─────────── Core admin / API endpoints ───────────
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/job-applications/", include("job_applications.urls")),
    path("cover/", include("AI_generator.urls")),
    path("api/contacts/", include("contacts.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    # ─────────── Google OAuth2 flow ───────────
    # 1. Always start the flow via this helper; it logs out any current session
    path("google/login/", google_login_clean, name="google_login"),
    # Override the complete view for Google OAuth
    path(
        "complete/google-oauth2/",
        social_auth_logout_then_complete,
        {"backend": "google-oauth2"},
        name="social:complete_google",
    ),
    path("google/login-custom/", google_login_clean, name="google_login"),
    # 2. Let social-django handle the rest of the handshake (/authorize/, /complete/, etc.)
    path("google/", include("social_django.urls", namespace="social")),
    # ─────────── Debug utilities ───────────
    path("debug/google-session/", google_debug_view),
]

# ─────────── Django-Debug-Toolbar (only in DEBUG) ───────────
if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns

# ─────────── Static files (development) ───────────
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
