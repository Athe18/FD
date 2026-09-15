"""
Prabal Main FastAPI Application
===============================
Intelligent Railway Maintenance Coordination & Automatic Block Optimization Platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Import API Routers
from app.api.v1.infrastructure import router as infra_router
from app.api.v1.assets import router as assets_router
from app.api.v1.maintenance import router as maintenance_router
from app.api.v1.trains import router as trains_router
from app.api.v1.planning import router as planning_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.integrations import router as integrations_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.ai import router as ai_router
from app.api.v1.ml import router as ml_router

app = FastAPI(
    title="Prabal - Railway Maintenance & Block Optimization Platform",
    description="Intelligent interoperability, decision-support, and automatic block optimization layer for Indian Railways (SIH 2026).",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(infra_router, prefix=settings.API_V1_STR)
app.include_router(assets_router, prefix=settings.API_V1_STR)
app.include_router(maintenance_router, prefix=settings.API_V1_STR)
app.include_router(trains_router, prefix=settings.API_V1_STR)
app.include_router(planning_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(integrations_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(ml_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "platform": "Prabal",
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
