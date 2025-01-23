from django.contrib import admin
from django.contrib.auth.views import login_required
from django.http import HttpResponse
from django.urls import include, path


@login_required()
def test_view(request):
    return HttpResponse("cats are cool")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("google/", include("social_django.urls", namespace="social")),
    path("", test_view, name="home"),
]
