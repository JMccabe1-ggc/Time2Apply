from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from config.client import supabase_public

router = APIRouter(prefix="/auth", tags=["auth"])


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> CurrentUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    if not credentials:
        raise credentials_exception

    try:
        user_response = supabase_public.auth.get_user(credentials.credentials)
        user = user_response.user
    except Exception:
        user = None

    if user is None:
        raise credentials_exception

    return CurrentUser(
        id=user.id,
        email=user.email,
        full_name=(user.user_metadata or {}).get("full_name"),
        disabled=False,
    )


async def get_current_active_user(
    current_user: Annotated[CurrentUser, Depends(get_current_user)],
) -> CurrentUser:
    return current_user


@router.get("/users/me/")
async def read_users_me(
    current_user: Annotated[CurrentUser, Depends(get_current_active_user)],
) -> CurrentUser:
    return current_user