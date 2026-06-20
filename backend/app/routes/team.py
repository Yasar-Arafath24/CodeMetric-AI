from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.dependencies import get_db

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User

from app.schemas.team_schema import TeamCreate
from app.schemas.team_member_schema import TeamMemberCreate

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


# Create Team
@router.post("/")
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db)
):
    new_team = Team(
        team_name=team.team_name,
        description=team.description,
        created_by=1
    )

    db.add(new_team)
    db.commit()
    db.refresh(new_team)

    return {
        "message": "Team created successfully",
        "team_id": new_team.id
    }


# Get All Teams
@router.get("/")
def get_all_teams(
    db: Session = Depends(get_db)
):
    teams = db.query(Team).all()

    result = []

    for team in teams:
        result.append({
            "id": team.id,
            "team_name": team.team_name,
            "description": team.description,
            "created_by": team.created_by
        })

    return result


# Add Team Member
@router.post("/add-member")
def add_team_member(
    member: TeamMemberCreate,
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(
        Team.id == member.team_id
    ).first()

    if not team:
        return {
            "message": "Team not found"
        }

    user = db.query(User).filter(
        User.id == member.user_id
    ).first()

    if not user:
        return {
            "message": "User not found"
        }

    existing_member = db.query(
        TeamMember
    ).filter(
        TeamMember.team_id == member.team_id,
        TeamMember.user_id == member.user_id
    ).first()

    if existing_member:
        return {
            "message": "User already exists in team"
        }

    new_member = TeamMember(
        team_id=member.team_id,
        user_id=member.user_id
    )

    db.add(new_member)
    db.commit()

    return {
        "message": "Member added successfully"
    }


# View Team Members
@router.get("/{team_id}/members")
def get_team_members(
    team_id: int,
    db: Session = Depends(get_db)
):
    members = (
        db.query(User)
        .join(
            TeamMember,
            TeamMember.user_id == User.id
        )
        .filter(
            TeamMember.team_id == team_id
        )
        .all()
    )

    result = []

    for member in members:
        result.append({
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "role": member.role
        })

    return result


# Remove Team Member
@router.delete("/{team_id}/members/{user_id}")
def remove_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    member = db.query(
        TeamMember
    ).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()

    if not member:
        return {
            "message": "Member not found"
        }

    db.delete(member)
    db.commit()

    return {
        "message": "Member removed successfully"
    }