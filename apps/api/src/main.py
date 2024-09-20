from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from .routes import router


def app():
    app = FastAPI()

    limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)

    @app.exception_handler(RateLimitExceeded)
    def rate_limit_execption_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
        response = JSONResponse({"error": f"Rate limit exceeded: {exc.detail}"}, status_code=429)
        response = request.app.state.limiter._inject_headers(response, request.state.view_rate_limit)  # noqa: SLF001
        return response

    origins = [
        "*",
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)

    return app
