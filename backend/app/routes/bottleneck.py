from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.bottleneck import Bottleneck
from app.models.developer_metric import DeveloperMetric

from app.services.bottleneck_service import (
    detect_bottleneck
)

router = APIRouter(
    prefix="/bottlenecks",
    tags=["Bottlenecks"]
)


@router.post("/{repository_id}/generate")
def generate_bottlenecks(
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

    db.query(
        Bottleneck
    ).filter(
        Bottleneck.repository_id == repository_id
    ).delete()

    for metric in metrics:

        analysis = detect_bottleneck(metric)

        bottleneck = Bottleneck(
            repository_id=repository_id,
            developer_name=metric.developer_name,
            risk_level=analysis["risk"],
            reason=analysis["reason"],
            recommendation=analysis["recommendation"]
        )

        db.add(bottleneck)

    db.commit()

    return {
        "message": "Bottleneck analysis completed"
    }


@router.get("/{repository_id}")
def get_bottlenecks(
    repository_id: int,
    db: Session = Depends(get_db)
):

    records = db.query(
        Bottleneck
    ).filter(
        Bottleneck.repository_id == repository_id
    ).all()

    result = []

    for item in records:

        result.append({
            "developer_name": item.developer_name,
            "risk_level": item.risk_level,
            "reason": item.reason,
            "recommendation": item.recommendation
        })

    return result


@router.get("/{repository_id}/summary")
def bottleneck_summary(
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
        "repository_id": repository_id,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "total_developers": len(records)
    }