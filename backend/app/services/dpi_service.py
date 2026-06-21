def calculate_dpi(
    total_commits,
    activity_score
):

    contribution_score = min(
        total_commits * 2,
        100
    )

    consistency_score = min(
        total_commits * 3,
        100
    )

    dpi_score = (
        activity_score * 0.4
        + consistency_score * 0.4
        + contribution_score * 0.2
    )

    return round(
        dpi_score,
        2
    )