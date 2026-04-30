from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import register, onspot, scan, admin, volunteer

# Create the FastAPI app
app = FastAPI(
    title="Job Fair 2026 API",
    description="API for Job Fair 2026 Registration System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", ""),
        os.getenv("RAILWAY_FRONTEND_URL", "")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(register.router, prefix="/api")
app.include_router(onspot.router, prefix="/api")
app.include_router(scan.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(volunteer.router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include other routers as needed