from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.developer_metric import DeveloperMetric
from app.models.developer_dpi import DeveloperDPI
from app.models.ai_insight import AIInsight

from app.services.ai_insight_service import (
    generate_insight
)

router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"]
)


@router.post("/{repository_id}/generate")
def generate_ai_insights(
    repository_id: int,
    db: Session = Depends(get_db)
):

    metrics = db.query(
        DeveloperMetric
    ).filter(
        DeveloperMetric.repository_id == repository_id
    ).all()

    if not metrics:
        return {
            "message": "Generate metrics first"
        }

    dpi_records = db.query(
        DeveloperDPI
    ).filter(
        DeveloperDPI.repository_id == repository_id
    ).all()

    dpi_map = {}

    for dpi in dpi_records:
        dpi_map[dpi.developer_name] = dpi.dpi_score

    db.query(
        AIInsight
    ).filter(
        AIInsight.repository_id == repository_id
    ).delete()

    for metric in metrics:

        dpi_score = dpi_map.get(
            metric.developer_name,
            0
        )

        insight_text = generate_insight(
            metric,
            dpi_score
        )

        insight = AIInsight(
            repository_id=repository_id,
            developer_name=metric.developer_name,
            insight=insight_text
        )

        db.add(insight)

    db.commit()

    return {
        "message": "AI Insights generated successfully"
    }


@router.get("/{repository_id}")
def get_ai_insights(
    repository_id: int,
    db: Session = Depends(get_db)
):

    insights = db.query(
        AIInsight
    ).filter(
        AIInsight.repository_id == repository_id
    ).all()

    result = []

    for item in insights:

        result.append({
            "developer_name": item.developer_name,
            "insight": item.insight
        })

    return result


@router.get("/{repository_id}/summary")
def insights_summary(
    repository_id: int,
    db: Session = Depends(get_db)
):

    insights = db.query(
        AIInsight
    ).filter(
        AIInsight.repository_id == repository_id
    ).all()

    return {
        "repository_id": repository_id,
        "total_insights": len(insights)
    }