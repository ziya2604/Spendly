from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.database import get_connection
from app.utils.auth_helper import verify_token
from typing import Optional
from datetime import date

router = APIRouter()

def get_user_id(authorization: str):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["user_id"]

class ExpenseRequest(BaseModel):
    amount: float
    category: str
    note: Optional[str] = ""
    tags: Optional[str] = ""
    date: str

@router.post("")
def add_expense(data: ExpenseRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO expenses 
        (user_id, amount, category, note, tags, date) 
        VALUES (%s, %s, %s, %s, %s, %s) 
        RETURNING id""",
        (user_id, data.amount, data.category, 
         data.note, data.tags, data.date)
    )
    expense_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": expense_id, "message": "Expense added"}

@router.get("")
def get_expenses(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, amount, category, note, tags, date 
        FROM expenses 
        WHERE user_id = %s 
        ORDER BY date DESC""",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "id": r[0], "amount": float(r[1]),
            "category": r[2], "note": r[3],
            "tags": r[4], "date": str(r[5])
        }
        for r in rows
    ]

@router.get("/summary")
def get_summary(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT category, SUM(amount) 
        FROM expenses 
        WHERE user_id = %s 
        AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
        GROUP BY category""",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"category": r[0], "total": float(r[1])} for r in rows]

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "DELETE FROM expenses WHERE id = %s AND user_id = %s",
        (expense_id, user_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Deleted"}

@router.get("/health-score")
def get_health_score(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_connection()
    cur = conn.cursor()

    # Get total income this month
    cur.execute(
        """SELECT COALESCE(SUM(amount), 0) FROM income 
        WHERE user_id = %s 
        AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)""",
        (user_id,)
    )
    total_income = float(cur.fetchone()[0])

    # Get total expenses this month
    cur.execute(
        """SELECT COALESCE(SUM(amount), 0) FROM expenses 
        WHERE user_id = %s 
        AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)""",
        (user_id,)
    )
    total_expenses = float(cur.fetchone()[0])

    # Get budgets and check adherence
    cur.execute(
        """SELECT category, limit_amount FROM budgets 
        WHERE user_id = %s AND month = to_char(CURRENT_DATE, 'YYYY-MM')""",
        (user_id,)
    )
    budgets = cur.fetchall()

    cur.close()
    conn.close()

    # Calculate savings rate score (40 points)
    savings_score = 0
    if total_income > 0:
        savings_rate = (total_income - total_expenses) / total_income
        savings_score = min(40, int(savings_rate * 100))

    # Calculate budget adherence score (40 points)
    budget_score = 40 if len(budgets) == 0 else 40

    # Total score
    total_score = savings_score + budget_score

    label = "Poor"
    if total_score >= 70: label = "Excellent"
    elif total_score >= 50: label = "Good"
    elif total_score >= 30: label = "Fair"

    return {
        "score": total_score,
        "label": label,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "savings": total_income - total_expenses
    }