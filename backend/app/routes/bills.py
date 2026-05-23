from fastapi import APIRouter
router = APIRouter()

@router.get("/test")
def test():
    return {"message": "bills route working"}