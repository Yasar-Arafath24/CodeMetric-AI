from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.models.base import Base


class DeveloperMetric(Base):
    __tablename__ = "developer_metrics"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    repository_id = Column(
        Integer,
        ForeignKey("repositories.id"),
        nullable=False
    )

    developer_name = Column(
        String,
        nullable=False
    )

    total_commits = Column(
        Integer,
        default=0
    )

    activity_score = Column(
        Integer,
        default=0
    )

    last_active = Column(
        DateTime
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )