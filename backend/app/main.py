from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, expenses, income, budgets, groups, goals, education, debts, bills, challenges

app = FastAPI(title="Spendly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])
app.include_router(income.router, prefix="/income", tags=["Income"])
app.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(goals.router, prefix="/goals", tags=["Goals"])
app.include_router(education.router, prefix="/education", tags=["Education"])
app.include_router(debts.router, prefix="/debts", tags=["Debts"])
app.include_router(bills.router, prefix="/bills", tags=["Bills"])
app.include_router(challenges.router, prefix="/challenges", tags=["Challenges"])

@app.get("/")
def root():
    return {"message": "Spendly API is running"}