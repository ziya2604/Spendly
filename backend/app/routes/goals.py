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
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload["user_id"]


class GoalRequest(BaseModel):

    title: str
    target_amount: float
    saved_amount: float = 0
    deadline: Optional[str] = None


@router.post("")
def add_goal(
    data: GoalRequest,
    authorization: str = Header(None)
):

    user_id = get_user_id(authorization)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO goals
        (
        user_id,
        title,
        target_amount,
        saved_amount,
        deadline
        )
        VALUES
        (%s,%s,%s,%s,%s)
        RETURNING id
        """,
        (
            user_id,
            data.title,
            data.target_amount,
            data.saved_amount,
            data.deadline
        )
    )

    goal_id = cur.fetchone()[0]

    conn.commit()

    cur.close()
    conn.close()

    return {
        "id": goal_id,
        "message": "Goal created"
    }


@router.get("")
def get_goals(
    authorization: str = Header(None)
):

    user_id = get_user_id(authorization)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
        id,
        title,
        target_amount,
        saved_amount,
        deadline
        FROM goals
        WHERE user_id=%s
        ORDER BY id DESC
        """,
        (user_id,)
    )

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "id": r[0],
            "title": r[1],
            "target_amount": float(r[2]),
            "saved_amount": float(r[3]),
            "deadline": str(r[4]) if r[4] else None
        }
        for r in rows
    ]


@router.put("/{goal_id}")
def update_goal(
    goal_id: int,
    amount: float,
    authorization: str = Header(None)
):

    user_id = get_user_id(authorization)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE goals
        SET saved_amount=%s
        WHERE id=%s
        AND user_id=%s
        """,
        (
            amount,
            goal_id,
            user_id
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    return {
        "message": "Updated"
    }


@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    authorization: str = Header(None)
):

    user_id = get_user_id(authorization)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        DELETE FROM goals
        WHERE id=%s
        AND user_id=%s
        """,
        (
            goal_id,
            user_id
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    return {
        "message": "Deleted"
    }