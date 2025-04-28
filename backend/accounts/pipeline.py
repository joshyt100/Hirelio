# accounts/pipeline.py


def log_social_user(strategy, backend, uid=None, user=None, *args, **kwargs):
    """
    Debug hook for the social-auth pipeline.
    Will log which Google UID and Django user (if any) are present.
    """
    print(f"[SOCIAL AUTH] backend={backend.name!r}  uid={uid!r}  user={user!r}")
