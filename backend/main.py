from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import audio_routes

app = FastAPI(title="EchoMap API", version="0.1.0-alpha")

app.include_router(audio_routes.router, prefix="/api/audio", tags=["audio"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to EchoMap API"}

@app.get("/status")
def get_status():
    return {"status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
