from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/test")
def test_dashboard():
    return {"message": "dashboard works"}

@router.get("/{repository_id}")
def get_dashboard(
    repository_id: int,
    db: Session = Depends(get_db)
):
    return {
        "repository_id": repository_id
    }
print(router.routes)