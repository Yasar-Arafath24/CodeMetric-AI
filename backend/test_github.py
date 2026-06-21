from app.services.github_service import get_repo_commits

data = get_repo_commits(
    "facebook",
    "react"
)

print("Total commits fetched:", len(data))

if data:
    print("First SHA:", data[0]["sha"])