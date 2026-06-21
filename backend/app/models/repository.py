from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime

from app.models.base import Base


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    repo_name = Column(
        String,
        nullable=False
    )

    repo_url = Column(
        String,
        nullable=False,
        unique=True
    )

    owner_name = Column(
        String,
        nullable=False
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )