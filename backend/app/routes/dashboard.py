print("DASHBOARD ROUTER LOADED")
print("DASHBOARD VERSION 3 LOADED")

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.repository import Repository
from app.models.commit import Commit
from app.models.developer_metric import DeveloperMetric
from app.models.repository_health import RepositoryHealth
from app.models.developer_dpi import DeveloperDPI
from app.models.bottleneck import Bottleneck
from app.models.ai_insight import AIInsight

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/test")
def test_dashboard():
    return {
        "message": "Dashboard router working successfully"
    }


@router.get("/{repository_id}")
def get_dashboard(
    repository_id: int,
    db: Session = Depends(get_db)
):

    repository = (
        db.query(Repository)
        .filter(Repository.id == repository_id)
        .first()
    )

    if not repository:
        return {
            "error": "Repository not found"
        }

    commit_count = (
        db.query(Commit)
        .filter(
            Commit.repository_id == repository_id
        )
        .count()
    )

    metrics = (
        db.query(DeveloperMetric)
        .filter(
            DeveloperMetric.repository_id == repository_id
        )
        .all()
    )

    developer_count = len(metrics)

    health = (
        db.query(RepositoryHealth)
        .filter(
            RepositoryHealth.repository_id == repository_id
        )
        .first()
    )

    contributors = []

    for metric in metrics:
        contributors.append({
            "developer_name": metric.developer_name,
            "total_commits": metric.total_commits
        })

    dpi_records = (
        db.query(DeveloperDPI)
        .filter(
            DeveloperDPI.repository_id == repository_id
        )
        .all()
    )

    dpi_data = []

    for dpi in dpi_records:
        dpi_data.append({
            "developer_name": dpi.developer_name,
            "dpi_score": dpi.dpi_score
        })

    bottlenecks = (
        db.query(Bottleneck)
        .filter(
            Bottleneck.repository_id == repository_id
        )
        .all()
    )

    bottleneck_data = []

    for bottleneck in bottlenecks:
        bottleneck_data.append({
            "developer_name": bottleneck.developer_name,
            "reason": bottleneck.reason
        })

    insights = (
        db.query(AIInsight)
        .filter(
            AIInsight.repository_id == repository_id
        )
        .all()
    )

    insight_data = []

    for insight in insights:
        insight_data.append({
            "developer_name": insight.developer_name,
            "insight": insight.insight,
            "created_at": str(insight.created_at)
        })

    return {
        "version": "dashboard_v3",
        "repository": repository.repo_name,
        "repo_url": repository.repo_url,
        "owner": repository.owner_name,
        "commits": commit_count,
        "developers": developer_count,
        "health_score": (
            health.health_score
            if health
            else 0
        ),
        "contributors": contributors,
        "dpi_scores": dpi_data,
        "bottlenecks": bottleneck_data,
        "ai_insights": insight_data
    }


print(router.routes)