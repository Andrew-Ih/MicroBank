from fastapi import FastAPI
from .database import create_tables
from .controllers import user_controller, account_controller, transaction_controller

app = FastAPI(title="Accounts Service")

app.include_router(user_controller.router)
app.include_router(account_controller.router)
app.include_router(transaction_controller.router)

@app.on_event("startup")
def startup_event():
    create_tables()

@app.get("/health")
def health_check():
    return {"status": "healthy"}
