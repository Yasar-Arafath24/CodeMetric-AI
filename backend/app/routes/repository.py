from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.repository import Repository
from app.models.project import Project

from app.schemas.repository_schema import RepositoryCreate

router = APIRouter(
    prefix="/repositories",
    tags=["Repositories"]
)
@router.post("/connect")
def connect_repository(
    repository: RepositoryCreate,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == repository.project_id
    ).first()

    if not project:
        return {
            "message": "Project not found"
        }

    existing_repo = db.query(
        Repository
    ).filter(
        Repository.repo_url == repository.repo_url
    ).first()

    if existing_repo:
        return {
            "message": "Repository already connected"
        }

    new_repo = Repository(
        repo_name=repository.repo_name,
        repo_url=repository.repo_url,
        owner_name=repository.owner_name,
        project_id=repository.project_id
    )

    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)

    return {
        "message": "Repository connected successfully",
        "repository_id": new_repo.id
    }
@router.get("/")
def get_all_repositories(
    db: Session = Depends(get_db)
):

    repositories = db.query(
        Repository
    ).all()

    result = []

    for repo in repositories:
        result.append({
            "id": repo.id,
            "repo_name": repo.repo_name,
            "repo_url": repo.repo_url,
            "owner_name": repo.owner_name,
            "project_id": repo.project_id
        })

    return result