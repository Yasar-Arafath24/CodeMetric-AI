from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.team import Team

from app.schemas.project_schema import ProjectCreate

from app.config.dependencies import get_db


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)
@router.post("/")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    team = db.query(Team).filter(
        Team.id == project.team_id
    ).first()

    if not team:
        return {
            "message": "Team not found"
        }

    new_project = Project(
        project_name=project.project_name,
        description=project.description,
        team_id=project.team_id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project created successfully",
        "project_id": new_project.id
    }
@router.get("/")
def get_all_projects(
    db: Session = Depends(get_db)
):

    projects = db.query(Project).all()

    result = []

    for project in projects:
        result.append({
            "id": project.id,
            "project_name": project.project_name,
            "description": project.description,
            "team_id": project.team_id
        })

    return result
@router.get("/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        return {
            "message": "Project not found"
        }

    return {
        "id": project.id,
        "project_name": project.project_name,
        "description": project.description,
        "team_id": project.team_id
    }