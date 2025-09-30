from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_tables
from .controllers import user_controller, account_controller, transaction_controller
import asyncio
from .outbox_publisher import publish_outbox_events

app = FastAPI(title="Accounts Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(account_controller.router)
app.include_router(transaction_controller.router)

@app.on_event("startup")
def startup_event():
    create_tables()
    # Start outbox publisher as background task
    asyncio.create_task(publish_outbox_events())

@app.get("/health")
def health_check():
    return {"status": "healthy"}
