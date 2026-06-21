from apscheduler.schedulers.background import (
    BackgroundScheduler
)

from app.services.automation_service import (
    auto_sync_all_repositories
)

scheduler = BackgroundScheduler()


def start_scheduler():

    scheduler.add_job(
        auto_sync_all_repositories,
        trigger="interval",
        minutes=5
    )

    scheduler.start()

    print(
        "CodeMetric Scheduler Started"
    )