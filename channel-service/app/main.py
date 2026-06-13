from fastapi import FastAPI

from app.send import router as send_router

app = FastAPI(
    title="Channel Service"
)

app.include_router(send_router)


@app.get("/")
def root():

    return {
        "message": "Channel Service Running"
    }