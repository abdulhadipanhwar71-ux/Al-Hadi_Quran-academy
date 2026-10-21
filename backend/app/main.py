from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
import logging

from .config import settings
from .api.public import router as public_router
from .api.admin import router as admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("alhadi.main")

app = FastAPI(
    title=settings.APP_NAME,
    description="Official API for Al-Hadi Online Quran Academy - Quranic education, courses, admission & schedule management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Include API Routers First
app.include_router(public_router)
app.include_router(admin_router)

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ASSETS_DIR = ROOT_DIR / "assets"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

# Mount frontend assets and provide SPA client fallback
if FRONTEND_DIST.exists():
  dist_assets = FRONTEND_DIST / "assets"
  if dist_assets.exists():
    app.mount("/assets", StaticFiles(directory=str(dist_assets)), name="static_assets")

  @app.get("/logo.jpg")
  def get_logo():
    logo_file = FRONTEND_DIST / "logo.jpg"
    if not logo_file.exists():
      logo_file = ASSETS_DIR / "logo.jpg"
    return FileResponse(str(logo_file), media_type="image/jpeg")

  @app.get("/{full_path:path}")
  async def spa_fallback(full_path: str):
    if full_path.startswith("api"):
      return JSONResponse(status_code=404, content={"detail": "Not found"})
    target = FRONTEND_DIST / full_path
    if target.is_file():
      return FileResponse(str(target))
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
      return FileResponse(str(index_file))
    return JSONResponse(status_code=404, content={"detail": "File not found"})
else:
  @app.get("/")
  def root():
    return {
        "academy": settings.APP_NAME,
        "administrator": settings.ADMIN_DISPLAY_NAME,
        "status": "online",
        "documentation": "/api/docs"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later or contact the academy administrator."}
    )
