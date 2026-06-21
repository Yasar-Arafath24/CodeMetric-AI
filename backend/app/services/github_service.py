import requests


def get_repo_commits(owner, repo):

    url = f"https://api.github.com/repos/{owner}/{repo}/commits"

    response = requests.get(url)

    if response.status_code != 200:
        return []

    return response.json()


def extract_owner_repo(repo_url):

    parts = repo_url.rstrip("/").split("/")

    owner = parts[-2]
    repo = parts[-1]

    return owner, repo