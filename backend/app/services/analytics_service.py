def calculate_average_dpi(
    dpi_records
):
    if not dpi_records:
        return 0

    total = sum(
        item.dpi_score
        for item in dpi_records
    )

    return round(
        total / len(dpi_records),
        2
    )


def get_top_performer(
    dpi_records
):
    if not dpi_records:
        return None

    return max(
        dpi_records,
        key=lambda x: x.dpi_score
    )


def get_lowest_performer(
    dpi_records
):
    if not dpi_records:
        return None

    return min(
        dpi_records,
        key=lambda x: x.dpi_score
    )