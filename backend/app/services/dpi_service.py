def calculate_dpi(
    commits,
    activity_score
):

    dpi = (
        commits * 4
    ) + (
        activity_score * 0.6
    )

    return min(
        int(dpi),
        100
    )