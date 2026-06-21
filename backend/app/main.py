from fastapi import FastAPI

from app.config.database import engine
from app.models.base import Base

# Import all models
from app.models.user import User
from app.models.team import Team
from app.models.project import Project
from app.models.team_member import TeamMember
from app.routes.auth import router as auth_router
from app.routes.team import router as team_router
from app.routes.project import router as project_router
from app.models.repository import Repository
from app.routes.repository import router as repository_router
from app.models.commit import Commit
from app.models.developer_metric import DeveloperMetric
print("PROJECT ROUTER IMPORTED")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CodeMetric AI"
)
app.include_router(auth_router)
app.include_router(team_router)
app.include_router(project_router)
app.include_router(repository_router)

@app.get("/")
def home():
    return {
        "project": "CodeMetric AI",
        "status": "running"
    }