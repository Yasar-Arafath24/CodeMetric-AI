from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.models.base import Base


class RepositoryHealth(Base):
    __tablename__ = "repository_health"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    repository_id = Column(
        Integer,
        ForeignKey("repositories.id"),
        unique=True
    )

    total_commits = Column(Integer)

    contributors = Column(Integer)

    health_score = Column(Integer)

    activity_level = Column(String)

    status = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )