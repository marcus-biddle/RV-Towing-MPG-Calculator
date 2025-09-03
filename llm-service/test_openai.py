import os
from openai import OpenAI
from dotenv import load_dotenv

# Load .env file if you have one
load_dotenv()

# Initialize client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")

client = OpenAI(api_key=api_key)

# Test prompt
prompt = "Write a one-sentence bedtime story about a unicorn."

try:
    response = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    # Try to get simple text output
    if hasattr(response, "output_text") and response.output_text:
        print("Output_text:", response.output_text)
    elif hasattr(response, "output") and response.output:
        # fallback structure
        print("Output:", response.output[0].content[0].text)
    else:
        print("No output returned from the API.")

except Exception as e:
    print("Error:", e)
