from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Float
)
from datetime import datetime

from app.models.base import Base


class DeveloperDPI(Base):
    __tablename__ = "developer_dpi"

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

    dpi_score = Column(
        Float,
        default=0
    )

    category = Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )