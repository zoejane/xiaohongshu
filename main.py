from fastapi import FastAPI, Request
import uvicorn
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import zhipuai
from dotenv import load_dotenv
import os
import zhipuai

load_dotenv()

app = FastAPI()

zhipuai.api_key = os.getenv("ZHIPU_API")

class Item(BaseModel):
    prompt: str | None = ''

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@app.post('/api/generate')
async def generate(item: Item):
    def stream():
        response = zhipuai.model_api.sse_invoke(
            model="chatglm_pro",
            prompt=[{"role": "user", "content": f"你好，请按照{item.prompt}的要求，生成小红书文案，要求包括三部分：标题、内容和标签"}],
            top_p=0.7,
            temperature=0.9,
        )
        for event in response.events():
            yield event.data
    
    return StreamingResponse(stream())

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000,  reload=True, log_level="info")
