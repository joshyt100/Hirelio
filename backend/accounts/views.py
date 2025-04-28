from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.views import method_decorator
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from social_core.actions import do_complete
from social_django.utils import psa
from social_django.views import _do_login
from django.shortcuts import redirect
import uuid

User = get_user_model()  # use the custom user model


# accounts/views.py
from django.contrib.auth import logout
from social_django.views import complete as social_complete
from django.contrib.auth import logout as django_logout


from django.http import JsonResponse
from social_django.utils import load_strategy

from social_django.views import auth as social_auth


def google_login_clean(request):
    # Extract state from query params
    state = request.GET.get("state")

    # Clear session
    request.session.flush()
    if request.user.is_authenticated:
        logout(request)

    # Store the state in the session for verification later
    if state:
        request.session["state"] = state

    # Redirect to the actual OAuth provider (important!)
    return redirect(f"/google/login/google-oauth2/?state={state}")


def google_debug_view(request):
    strategy = load_strategy(request)
    session_data = dict(request.session.items())

    # Only dump session keys related to Google
    google_session_data = {
        k: v for k, v in session_data.items() if "google" in k.lower()
    }

    return JsonResponse(google_session_data, safe=False)


def social_auth_logout_then_complete(request, backend):
    print("✅ CUSTOM COMPLETE: Logging out user before social-auth...")

    if request.user.is_authenticated:
        logout(request)  # ✅ Properly logs out without damaging session integrity

    return social_complete(request, backend)


@method_decorator(csrf_protect, name="dispatch")
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Create user using email and password
            user = User.objects.create_user(email=email, password=password)
            # Authenticate the user
            authenticated_user = authenticate(request, email=email, password=password)
            if authenticated_user:
                login(request, authenticated_user)
                return Response(
                    {"message": "Account created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"error": "Authentication failed after user creation."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow any user to login

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)  # create session
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return redirect("http://127.0.0.1:5173/")


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFTokenView(APIView):
    def get(self, request, format=None):
        return JsonResponse({"success": "CSRF cookie set"})


@never_cache
@csrf_exempt
@psa("social:complete")
def complete(request, backend, *args, **kwargs):
    """Override this method so we can force user to be logged out."""
    REDIRECT_FIELD_NAME = "next"  # Define this constant
    return do_complete(
        request.backend,
        _do_login,
        user=None,
        redirect_name=REDIRECT_FIELD_NAME,
        request=request,
        *args,
        **kwargs,
    )


class UserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(
                {
                    "isAuthenticated": True,
                    "user": {
                        "email": request.user.email,
                        # Add other user fields you need
                    },
                }
            )
        return Response({"isAuthenticated": False})
