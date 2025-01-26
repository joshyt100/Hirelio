from django.contrib.auth import views as auth_views  # import for password_reset views *
from django.urls import include, path

from .views import GetCSRFTokenView, LoginView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path(
        "password_reset/", auth_views.PasswordResetView.as_view(), name="password_reset"
    ),
    path(
        "password_reset/done",
        auth_views.PasswordResetDoneView.as_view(),
        name="password-reset-done",
    ),
    path(
        "reset/<uidb64>/<token>",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "reset/done",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password-reset-complete",
    ),
    path("csrf/", GetCSRFTokenView.as_view(), name="csrf"),
    # path("complete/<str:backend>/", complete, name="complete"),
    # path("google/", include("social_django.urls", namespace="social")),
]
