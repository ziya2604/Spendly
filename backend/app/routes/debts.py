from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.database import get_connection
from app.utils.auth_helper import verify_token

router = APIRouter()

def get_user_id(authorization: str = Header(None)):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Login required"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload["user_id"]

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload["user_id"]


class DebtRequest(BaseModel):

    person_name: str

    amount: float

    debt_type: str


@router.post("")
def add_debt(
    data: DebtRequest,
    authorization: str = Header(None)
):

    user_id = get_user_id(
        authorization
    )

    conn = get_connection()

    cur = conn.cursor()

    cur.execute(

        """

        INSERT INTO debts

        (

        user_id,

        person_name,

        amount,

        debt_type

        )

        VALUES

        (%s,%s,%s,%s)

        RETURNING id

        """,

        (

        user_id,

        data.person_name,

        data.amount,

        data.debt_type

        )

    )

    debt_id = cur.fetchone()[0]

    conn.commit()

    cur.close()

    conn.close()

    return {

        "id": debt_id,

        "message": "Debt added"

    }


@router.get("")
def get_debts(
    authorization: str = Header(None)
):

    user_id = get_user_id(
        authorization
    )

    conn = get_connection()

    cur = conn.cursor()

    cur.execute(

        """

        SELECT

        id,

        person_name,

        amount,

        debt_type

        FROM debts

        WHERE user_id=%s

        ORDER BY id DESC

        """,

        (

        user_id,

        )

    )

    rows = cur.fetchall()

    cur.close()

    conn.close()

    return [

        {

        "id": r[0],

        "person_name": r[1],

        "amount": float(r[2]),

        "debt_type": r[3]

        }

        for r in rows

    ]


@router.delete("/{debt_id}")
def delete_debt(
    debt_id: int,
    authorization: str = Header(None)
):

    user_id = get_user_id(
        authorization
    )

    conn = get_connection()

    cur = conn.cursor()

    cur.execute(

        """

        DELETE FROM debts

        WHERE id=%s

        AND user_id=%s

        """,

        (

        debt_id,

        user_id

        )

    )

    conn.commit()

    cur.close()

    conn.close()

    return {

        "message": "Deleted"

    }