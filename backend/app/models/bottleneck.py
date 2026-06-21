from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from datetime import datetime

from app.models.base import Base


class Bottleneck(Base):
    __tablename__ = "bottlenecks"

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
        String,
        nullable=False
    )

    risk_level = Column(
        String
    )

    reason = Column(
        String
    )

    recommendation = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )