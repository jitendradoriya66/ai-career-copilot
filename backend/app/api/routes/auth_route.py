from fastapi import APIRouter, HTTPException, status
from app.core.auth import LoginRequest, TokenResponse, create_access_token

router = APIRouter()

@router.post("/auth/token", response_model=TokenResponse)
async def login_for_access_token(request: LoginRequest):
    """
    Authenticates user credentials and issues a JWT access token.
    """
    if not request.username or not request.password:
        raise HTTPException(status_code=400, detail="Username and password required.")

    # Demo Authentication Check
    token = create_access_token(data={"sub": request.username, "role": "candidate"})
    return TokenResponse(access_token=token)
