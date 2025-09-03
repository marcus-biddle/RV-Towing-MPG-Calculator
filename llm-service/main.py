import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Initialize client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")

client = OpenAI(api_key=api_key)

# FastAPI app
app = FastAPI(title="Stock News LLM Service")

# Request model
class StockNewsRequest(BaseModel):
    headlines: List[str]

# Response model
class StockSummaryResponse(BaseModel):
    summary: str

@app.post("/summarize", response_model=StockSummaryResponse)
async def summarize_stock_news(request: StockNewsRequest):
    try:
        prompt = (
            "Summarize the following stock news headlines in 2-3 sentences, "
            "highlighting key points for investors:\n" +
            "\n".join(f"- {h}" for h in request.headlines)
        )

        response = client.responses.create(
            model="gpt-5",
            input=prompt,
        )

        # Extract the summary text
        summary_text = getattr(response, "output_text", None)
        if not summary_text and hasattr(response, "output"):
            summary_text = response.output[0].content[0].text

        return StockSummaryResponse(summary=summary_text.strip())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
