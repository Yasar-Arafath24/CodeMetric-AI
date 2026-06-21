from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.models.base import Base


class Commit(Base):
    __tablename__ = "commits"

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

    commit_sha = Column(
        String,
        unique=True,
        nullable=False
    )

    author_name = Column(
        String,
        nullable=False
    )

    commit_message = Column(
        String,
        nullable=False
    )

    commit_date = Column(
        DateTime,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )