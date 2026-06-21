from sqlalchemy.orm import Session

from app.config.database import SessionLocal

from app.models.repository import Repository

from app.tasks.background_tasks import (
    sync_repository_commits
)


def auto_sync_all_repositories():

    db: Session = SessionLocal()

    try:

        repositories = db.query(
            Repository
        ).all()

        for repository in repositories:

            sync_repository_commits(
                repository.id
            )

        print(
            f"Auto Sync Completed: {len(repositories)} repositories"
        )

    except Exception as e:

        print(
            f"Automation Error: {e}"
        )

    finally:

        db.close()