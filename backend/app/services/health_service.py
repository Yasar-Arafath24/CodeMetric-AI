def calculate_health_score(
    total_commits,
    contributors
):

    commit_score = min(
        total_commits,
        50
    )

    contributor_score = min(
        contributors * 10,
        50
    )

    health_score = (
        commit_score +
        contributor_score
    )

    return min(
        health_score,
        100
    )