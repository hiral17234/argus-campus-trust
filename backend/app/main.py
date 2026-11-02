
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application startup
    print("ARGUS API is starting...")
    yield
    # Application shutdown
    print("ARGUS API is shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-powered risk-adaptive identity verification "
        "and smart attendance platform."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["General"])
def root():
    return {
        "application": "ARGUS",
        "message": "ARGUS API is running",
        "status": "operational",
    }


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "application": "ARGUS",
        "version": "1.0.0",
    }
