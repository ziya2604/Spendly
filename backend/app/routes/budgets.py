from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.database import get_connection
from app.utils.auth_helper import verify_token

router = APIRouter()

def get_user_id(auth):
    token = auth.replace("Bearer ", "")
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload["user_id"]

class BudgetRequest(BaseModel):
    category:str
    limit_amount:float
    month:str

@router.post("")
def add_budget(
    data: BudgetRequest,
    authorization:str=Header(None)
):
    user_id=get_user_id(authorization)

    conn=get_connection()
    cur=conn.cursor()

    cur.execute(
        """
        INSERT INTO budgets
        (user_id,category,limit_amount,month)
        VALUES(%s,%s,%s,%s)
        RETURNING id
        """,
        (
            user_id,
            data.category,
            data.limit_amount,
            data.month
        )
    )

    budget_id=cur.fetchone()[0]

    conn.commit()

    cur.close()
    conn.close()

    return {"id":budget_id}

@router.get("")
def get_budgets(
    authorization:str=Header(None)
):
    user_id=get_user_id(authorization)

    conn=get_connection()
    cur=conn.cursor()

    cur.execute(
        """
        SELECT
        id,
        category,
        limit_amount,
        month
        FROM budgets
        WHERE user_id=%s
        """,
        (user_id,)
    )

    rows=cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id":r[0],
            "category":r[1],
            "limit_amount":float(r[2]),
            "month":r[3]
        }
        for r in rows
    ]
