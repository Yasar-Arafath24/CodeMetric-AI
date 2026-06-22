from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.models.base import Base


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    repository_id = Column(
        Integer,
        ForeignKey("repositories.id")
    )

    developer_name = Column(
        String
    )

    insight = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )