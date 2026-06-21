from datetime import datetime


def detect_bottleneck(metric):

    days_inactive = (
        datetime.utcnow() -
        metric.last_active
    ).days

    if days_inactive >= 14:

        return {
            "risk": "High",
            "reason": f"No commits for {days_inactive} days",
            "recommendation":
            "Developer requires immediate attention"
        }

    if metric.total_commits <= 2:

        return {
            "risk": "Medium",
            "reason": "Very low contribution",
            "recommendation":
            "Increase development participation"
        }

    if metric.total_commits >= 100:

        return {
            "risk": "Medium",
            "reason": "Potential overload",
            "recommendation":
            "Distribute workload across team"
        }

    return {
        "risk": "Low",
        "reason": "Healthy contribution pattern",
        "recommendation": "No action required"
    }