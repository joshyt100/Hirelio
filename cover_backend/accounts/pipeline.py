import logging

from django.contrib.auth import get_user_model
from social_core.exceptions import AuthException

logger = logging.getLogger(__name__)

User = get_user_model()


def create_or_get_user(strategy, details, backend, user=None, *args, **kwargs):
    logger.debug(f"Pipeline details: {details}")
    if user:
        return {"is_new": False}

    email = details.get("email")
    if not email:
        raise AuthException(backend, "Email not found")

    user, created = User.objects.get_or_create(email=email)
    logger.debug(f"User created: {created}, User: {user}")
    return {"is_new": created, "user": user}
