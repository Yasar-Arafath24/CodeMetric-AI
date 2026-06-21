from fastapi import FastAPI

from app.config.database import engine
from app.models.base import Base

# Initialize FastAPI app first
app = FastAPI(
    title="CodeMetric AI"
)

# Create all database tables
Base.metadata.create_all(bind=engine)

# Import all models
from app.models.user import User
from app.models.team import Team
from app.models.project import Project
from app.models.team_member import TeamMember
from app.models.repository import Repository
from app.models.commit import Commit
from app.models.developer_metric import DeveloperMetric
from app.models.repository_health import RepositoryHealth
from app.models.developer_dpi import DeveloperDPI

# Import and include routers
from app.routes.auth import router as auth_router
from app.routes.team import router as team_router
from app.routes.project import router as project_router
from app.routes.repository import router as repository_router
from app.routes.automation import router as automation_router

# Include all routers
app.include_router(auth_router)
app.include_router(team_router)
app.include_router(project_router)
app.include_router(repository_router)
app.include_router(automation_router)

@app.get("/")
def home():
    return {
        "project": "CodeMetric AI",
        "status": "running"
    }