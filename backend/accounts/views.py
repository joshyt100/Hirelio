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

User = get_user_model()  # use the custom user model


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


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(
            {"message": "Logged out successfully"}, status=status.HTTP_200_OK
        )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFTokenView(APIView):
    def get(self, request, format=None):
        return JsonResponse({"success": "CSRF cookie set"})


@never_cache
@csrf_exempt
@psa("social:complete")
def complete(request, backend, *args, **kwargs):
    """Override this method so we can force user to be logged out."""
    return do_complete(
        request.backend,
        _do_login,
        user=None,
        redirect_name=REDIRECT_FIELD_NAME,
        request=request,
        *args,
        **kwargs
    )
