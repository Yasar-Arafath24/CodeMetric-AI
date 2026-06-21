from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.repository import Repository
from app.models.project import Project
from app.models.developer_metric import DeveloperMetric
from app.services.metrics_service import calculate_developer_metrics
from app.models.repository_health import RepositoryHealth
from app.models.developer_metric import DeveloperMetric

from app.services.health_service import (
    calculate_health_score
)
from app.schemas.repository_schema import RepositoryCreate

router = APIRouter(
    prefix="/repositories",
    tags=["Repositories"]
)
from app.models.commit import Commit
from app.services.github_service import (
    get_repo_commits,
    extract_owner_repo
)
@router.post("/connect")
def connect_repository(
    repository: RepositoryCreate,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == repository.project_id
    ).first()

    if not project:
        return {
            "message": "Project not found"
        }

    existing_repo = db.query(
        Repository
    ).filter(
        Repository.repo_url == repository.repo_url
    ).first()

    if existing_repo:
        return {
            "message": "Repository already connected"
        }

    new_repo = Repository(
        repo_name=repository.repo_name,
        repo_url=repository.repo_url,
        owner_name=repository.owner_name,
        project_id=repository.project_id
    )

    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)

    return {
        "message": "Repository connected successfully",
        "repository_id": new_repo.id
    }
@router.get("/")
def get_all_repositories(
    db: Session = Depends(get_db)
):

    repositories = db.query(
        Repository
    ).all()

    result = []

    for repo in repositories:
        result.append({
            "id": repo.id,
            "repo_name": repo.repo_name,
            "repo_url": repo.repo_url,
            "owner_name": repo.owner_name,
            "project_id": repo.project_id
        })

    return result
@router.post("/{repository_id}/sync-commits")
def sync_commits(
    repository_id: int,
    db: Session = Depends(get_db)
):

    repository = db.query(
        Repository
    ).filter(
        Repository.id == repository_id
    ).first()

    if not repository:
        return {
            "message": "Repository not found"
        }

    owner, repo = extract_owner_repo(
        repository.repo_url
    )

    commits = get_repo_commits(
        owner,
        repo
    )

    saved_count = 0

    for item in commits:

        sha = item["sha"]

        existing_commit = db.query(
            Commit
        ).filter(
            Commit.commit_sha == sha
        ).first()

        if existing_commit:
            continue

        new_commit = Commit(
            repository_id=repository.id,
            commit_sha=sha,
            author_name=item["commit"]["author"]["name"],
            commit_message=item["commit"]["message"],
            commit_date=item["commit"]["author"]["date"]
        )

        db.add(new_commit)

        saved_count += 1

    db.commit()

    return {
        "message": "Commits synchronized",
        "saved_commits": saved_count
    }
@router.post("/{repository_id}/generate-metrics")
def generate_metrics(
    repository_id: int,
    db: Session = Depends(get_db)
):

    commits = db.query(
        Commit
    ).filter(
        Commit.repository_id == repository_id
    ).all()

    if not commits:
        return {
            "message": "No commits found"
        }

    metrics = calculate_developer_metrics(
        commits
    )

    db.query(
        DeveloperMetric
    ).filter(
        DeveloperMetric.repository_id == repository_id
    ).delete()

    for developer, total_commits in metrics.items():

        activity_score = min(
            total_commits * 5,
            100
        )

        last_commit = None

        for commit in commits:
            if commit.author_name == developer:
                last_commit = commit.commit_date

        metric = DeveloperMetric(
            repository_id=repository_id,
            developer_name=developer,
            total_commits=total_commits,
            activity_score=activity_score,
            last_active=last_commit
        )

        db.add(metric)

    db.commit()

    return {
        "message": "Metrics generated successfully"
    }
@router.get("/{repository_id}/metrics")
def get_metrics(
    repository_id: int,
    db: Session = Depends(get_db)
):

    metrics = db.query(
        DeveloperMetric
    ).filter(
        DeveloperMetric.repository_id == repository_id
    ).all()

    result = []

    for metric in metrics:

        result.append({
            "developer_name": metric.developer_name,
            "total_commits": metric.total_commits,
            "activity_score": metric.activity_score,
            "last_active": metric.last_active
        })

    return result
@router.post("/{repository_id}/generate-health")
def generate_health(
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

    total_commits = sum(
        metric.total_commits
        for metric in metrics
    )

    contributors = len(metrics)

    score = calculate_health_score(
        total_commits,
        contributors
    )

    activity_level = "Low"

    if total_commits >= 20:
        activity_level = "Medium"

    if total_commits >= 50:
        activity_level = "High"

    status = "Needs Attention"

    if score >= 50:
        status = "Good"

    if score >= 80:
        status = "Healthy"

    existing = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()

    health = RepositoryHealth(
        repository_id=repository_id,
        total_commits=total_commits,
        contributors=contributors,
        health_score=score,
        activity_level=activity_level,
        status=status
    )

    db.add(health)
    db.commit()

    return {
        "message": "Repository health generated"
    }
@router.get("/{repository_id}/health")
def get_health(
    repository_id: int,
    db: Session = Depends(get_db)
):

    health = db.query(
        RepositoryHealth
    ).filter(
        RepositoryHealth.repository_id == repository_id
    ).first()

    if not health:
        return {
            "message": "Health score not generated"
        }

    return {
        "repository_id": health.repository_id,
        "health_score": health.health_score,
        "status": health.status,
        "activity_level": health.activity_level,
        "contributors": health.contributors,
        "total_commits": health.total_commits
    }
@router.get("/{repository_id}/top-contributors")
def get_top_contributors(
    repository_id: int,
    db: Session = Depends(get_db)
):

    contributors = (
        db.query(
            DeveloperMetric
        )
        .filter(
            DeveloperMetric.repository_id == repository_id
        )
        .order_by(
            DeveloperMetric.total_commits.desc()
        )
        .limit(10)
        .all()
    )

    if not contributors:
        return {
            "message": "No contributor metrics found"
        }

    total_repo_commits = sum(
        contributor.total_commits
        for contributor in contributors
    )

    result = []

    rank = 1

    for contributor in contributors:

        percentage = 0

        if total_repo_commits > 0:
            percentage = round(
                (
                    contributor.total_commits
                    / total_repo_commits
                ) * 100,
                2
            )

        result.append({
            "rank": rank,
            "developer_name": contributor.developer_name,
            "total_commits": contributor.total_commits,
            "activity_score": contributor.activity_score,
            "contribution_percentage": percentage
        })

        rank += 1

    return result