def calculate_velocity(total_commits, contributors):
    if contributors == 0:
        return 0

    return round(total_commits / contributors, 2)


def calculate_team_score(
    health_score,
    avg_dpi,
    contributors,
    high_risk_count
):
    score = (
        (health_score * 0.4)
        + (avg_dpi * 0.4)
        + (contributors * 2)
        - (high_risk_count * 5)
    )

    return round(score, 2)


def executive_recommendation(
    health_score,
    avg_dpi,
    high_risk_count
):
    if high_risk_count >= 3:
        return (
            "Reduce workload and increase collaboration."
        )

    if avg_dpi < 50:
        return (
            "Improve development productivity."
        )

    if health_score < 60:
        return (
            "Repository requires maintenance attention."
        )

    return (
        "Repository performing well."
    )