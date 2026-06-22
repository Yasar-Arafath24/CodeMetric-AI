def generate_insight(metric, dpi_score):

    commits = metric.total_commits

    if dpi_score >= 80:
        return (
            f"{metric.developer_name} is a high-performing contributor "
            f"with {commits} commits and DPI score {dpi_score}."
        )

    elif dpi_score >= 60:
        return (
            f"{metric.developer_name} shows consistent contribution "
            f"with {commits} commits and DPI score {dpi_score}."
        )

    elif dpi_score >= 40:
        return (
            f"{metric.developer_name} has moderate activity. "
            f"Additional contribution may improve performance."
        )

    else:
        return (
            f"{metric.developer_name} appears inactive or at risk. "
            f"Review workload and participation."
        )