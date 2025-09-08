from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from src.core.config import get_app_settings
from src.core.logger import get_logger

# routes
from src.routes.router import base
from src.routes import translate, translations

logger = get_logger(__name__)
settings = get_app_settings()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_url,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(base)
app.include_router(translate.router)
app.include_router(translations.router)

@app.get("/", include_in_schema=False)
def root_redirect_to_docs():
    logger.info("Redirecting root to /docs")
    return RedirectResponse(url="/docs")