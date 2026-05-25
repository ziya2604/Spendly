from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.database import get_connection
from app.utils.auth_helper import verify_token
from typing import Optional

router = APIRouter()

def get_user_id(authorization: str):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

class IncomeRequest(BaseModel):
    amount: float
    source: str
    date: str
    note: Optional[str] = ""

@router.post("")
def add_income(data: IncomeRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO income (user_id, amount, source, date, note)
        VALUES (%s, %s, %s, %s, %s) RETURNING id""",
        (user_id, data.amount, data.source, data.date, data.note)
    )
    income_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": income_id, "message": "Income added"}

@router.get("")
def get_income(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, amount, source, date, note 
        FROM income WHERE user_id = %s 
        ORDER BY date DESC""",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": r[0], "amount": float(r[1]),
            "source": r[2], "date": str(r[3]),
            "note": r[4]
        }
        for r in rows
    ]

@router.get("/summary")
def get_income_summary(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT SUM(amount) FROM income 
        WHERE user_id = %s 
        AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)""",
        (user_id,)
    )
    total = cur.fetchone()[0] or 0
    cur.close()
    conn.close()
    return {"total_income": float(total)}

@router.delete("/{income_id}")
def delete_income(income_id: int, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM income WHERE id = %s AND user_id = %s",
        (income_id, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Deleted"}