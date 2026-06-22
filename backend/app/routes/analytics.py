from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.developer_dpi import DeveloperDPI
from app.models.repository_health import RepositoryHealth
from app.models.bottleneck import Bottleneck
from app.models.developer_metric import DeveloperMetric

from app.services.analytics_service import (
    calculate_average_dpi,
    get_top_performer,
    get_lowest_performer
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/{repository_id}/productivity-trend")
def productivity_trend(
    repository_id: int,
    db: Session = Depends(get_db)
):

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).all()

    avg_dpi = calculate_average_dpi(
        dpi_records
    )

    top = get_top_performer(
        dpi_records
    )

    low = get_lowest_performer(
        dpi_records
    )

    return {
        "average_dpi": avg_dpi,
        "top_performer":
            top.developer_name if top else None,
        "lowest_performer":
            low.developer_name if low else None,
        "contributors":
            len(dpi_records)
    }


@router.get("/{repository_id}/risk-distribution")
def risk_distribution(
    repository_id: int,
    db: Session = Depends(get_db)
):

    records = db.query(
        Bottleneck
    ).filter(
        Bottleneck.repository_id == repository_id
    ).all()

    high = 0
    medium = 0
    low = 0

    for item in records:

        if item.risk_level == "High":
            high += 1

        elif item.risk_level == "Medium":
            medium += 1

        else:
            low += 1

    return {
        "high": high,
        "medium": medium,
        "low": low
    }


@router.get("/{repository_id}/summary")
def repository_summary(
    repository_id: int,
    db: Session = Depends(get_db)
):

    health = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).all()

    avg_dpi = calculate_average_dpi(
        dpi_records
    )

    return {
        "health_score":
            health.health_score if health else 0,

        "contributors":
            health.contributors if health else 0,

        "total_commits":
            health.total_commits if health else 0,

        "avg_dpi":
            avg_dpi
    }


@router.get("/{repository_id}/leaderboard")
def leaderboard(
    repository_id: int,
    db: Session = Depends(get_db)
):

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).order_by(
        DeveloperDPI.dpi_score.desc()
    ).all()

    result = []

    rank = 1

    for item in dpi_records:

        result.append({
            "rank": rank,
            "developer": item.developer_name,
            "dpi": item.dpi_score,
            "category": item.category
        })

        rank += 1

    return result
from app.services.advanced_analytics_service import (
    calculate_velocity,
    calculate_team_score,
    executive_recommendation
)
@router.get("/{repository_id}/velocity")
def velocity(
    repository_id: int,
    db: Session = Depends(get_db)
):

    health = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    if not health:
        return {
            "message": "Repository health not generated"
        }

    velocity_score = calculate_velocity(
        health.total_commits,
        health.contributors
    )

    return {
        "repository_id": repository_id,
        "velocity_score": velocity_score,
        "total_commits": health.total_commits,
        "contributors": health.contributors
    }
@router.get("/{repository_id}/team-scorecard")
def team_scorecard(
    repository_id: int,
    db: Session = Depends(get_db)
):

    health = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).all()

    bottlenecks = db.query(
        Bottleneck
    ).filter(
        Bottleneck.repository_id == repository_id
    ).all()

    if not health:
        return {
            "message": "Repository health not found"
        }

    avg_dpi = calculate_average_dpi(
        dpi_records
    )

    high_risk = len([
        item for item in bottlenecks
        if item.risk_level == "High"
    ])

    score = calculate_team_score(
        health.health_score,
        avg_dpi,
        health.contributors,
        high_risk
    )

    return {
        "team_score": score,
        "health_score": health.health_score,
        "average_dpi": avg_dpi,
        "contributors": health.contributors,
        "high_risk_developers": high_risk
    }
@router.get("/{repository_id}/heatmap")
def heatmap(
    repository_id: int,
    db: Session = Depends(get_db)
):

    metrics = db.query(
        DeveloperMetric
    ).filter(
        DeveloperMetric.repository_id == repository_id
    ).all()

    result = []

    for item in metrics:

        result.append({
            "developer": item.developer_name,
            "commits": item.total_commits,
            "activity_score": item.activity_score
        })

    return result
@router.get("/{repository_id}/executive-summary")
def executive_summary(
    repository_id: int,
    db: Session = Depends(get_db)
):

    health = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).all()

    bottlenecks = db.query(
        Bottleneck
    ).filter(
        Bottleneck.repository_id == repository_id
    ).all()

    if not health:
        return {
            "message": "Repository health not found"
        }

    avg_dpi = calculate_average_dpi(
        dpi_records
    )

    high_risk = len([
        item for item in bottlenecks
        if item.risk_level == "High"
    ])

    top = get_top_performer(
        dpi_records
    )

    recommendation = executive_recommendation(
        health.health_score,
        avg_dpi,
        high_risk
    )

    return {
        "repository_health": health.status,
        "health_score": health.health_score,
        "average_dpi": avg_dpi,
        "top_performer":
            top.developer_name if top else None,
        "high_risk_developers": high_risk,
        "recommendation": recommendation
    }