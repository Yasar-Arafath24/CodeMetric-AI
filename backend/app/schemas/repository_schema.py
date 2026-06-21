from pydantic import BaseModel


class RepositoryCreate(BaseModel):
    repo_name: str
    repo_url: str
    owner_name: str
    project_id: int