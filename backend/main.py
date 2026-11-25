from fastapi import FastAPI, status

app = FastAPI()
app.frontend("/", directory="../frontend/dist")


@app.get("/api/health")
async def health():
    return {"status": status.HTTP_200_OK}
