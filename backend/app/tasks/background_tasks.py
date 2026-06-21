from app.services.github_service import (
    get_repo_commits,
    extract_owner_repo
)

from app.models.commit import Commit
from app.models.repository import Repository
from app.config.database import SessionLocal


def sync_repository_commits(repository_id: int):

    db = SessionLocal()

    try:

        repository = (
            db.query(Repository)
            .filter(Repository.id == repository_id)
            .first()
        )

        if not repository:
            return

        owner, repo = extract_owner_repo(
            repository.repo_url
        )

        commits = get_repo_commits(
            owner,
            repo
        )

        for item in commits:

            sha = item["sha"]

            existing = (
                db.query(Commit)
                .filter(Commit.commit_sha == sha)
                .first()
            )

            if existing:
                continue

            commit = Commit(
                repository_id=repository.id,
                commit_sha=sha,
                author_name=item["commit"]["author"]["name"],
                commit_message=item["commit"]["message"],
                commit_date=item["commit"]["author"]["date"]
            )

            db.add(commit)

        db.commit()

    finally:
        db.close()