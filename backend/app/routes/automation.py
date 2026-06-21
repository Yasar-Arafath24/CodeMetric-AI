from fastapi import APIRouter

router = APIRouter(
    prefix="/automation",
    tags=["Automation"]
)

@router.post("/run-test")
def run_test():

    print("Automation Task Executed")

    return {
        "message": "Automation executed successfully"
    }