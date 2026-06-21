from collections import defaultdict


def calculate_developer_metrics(commits):

    metrics = defaultdict(int)

    for commit in commits:
        metrics[commit.author_name] += 1

    return metrics