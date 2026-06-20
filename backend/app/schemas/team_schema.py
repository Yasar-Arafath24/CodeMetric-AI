from pydantic import BaseModel


class TeamCreate(BaseModel):
    team_name: str
    description: str


class TeamResponse(BaseModel):
    id: int
    team_name: str
    description: str
    created_by: int

    class Config:
        from_attributes = True