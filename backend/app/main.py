from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import engine
from app.models.base import Base

from app.scheduler import start_scheduler

# =========================
# Import Models
# =========================

from app.models.user import User
from app.models.team import Team
from app.models.project import Project
from app.models.team_member import TeamMember
from app.models.repository import Repository
from app.models.commit import Commit
from app.models.developer_metric import DeveloperMetric
from app.models.repository_health import RepositoryHealth
from app.models.developer_dpi import DeveloperDPI
from app.models.bottleneck import Bottleneck
from app.models.ai_insight import AIInsight

# =========================
# Create FastAPI App
# =========================

app = FastAPI(
    title="CodeMetric AI",
    version="Phase 8",
    description="AI-Powered Developer Productivity Intelligence Platform"
)

# =========================
# Enable CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Create Database Tables
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# Start Scheduler
# =========================

start_scheduler()

# =========================
# Import Routers
# =========================

from app.routes.auth import router as auth_router
from app.routes.team import router as team_router
from app.routes.project import router as project_router
from app.routes.repository import router as repository_router
from app.routes.automation import router as automation_router
from app.routes.bottleneck import router as bottleneck_router
from app.routes.ai_insight import router as ai_insight_router
from app.routes.dashboard import router as dashboard_router
from app.routes.analytics import router as analytics_router

# =========================
# Register Routers
# =========================

app.include_router(auth_router)
app.include_router(team_router)
app.include_router(project_router)
app.include_router(repository_router)
app.include_router(automation_router)
app.include_router(bottleneck_router)
app.include_router(ai_insight_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)

# =========================
# Home Route
# =========================

@app.get("/")
def home():
    return {
        "project": "CodeMetric AI",
        "status": "running",
        "version": "Phase 8",
        "features": [
            "Authentication",
            "Team Management",
            "Project Management",
            "Repository Monitoring",
            "Developer Metrics",
            "Developer DPI",
            "Bottleneck Detection",
            "AI Insights",
            "Analytics Dashboard",
            "Automation Scheduler"
        ]
    }