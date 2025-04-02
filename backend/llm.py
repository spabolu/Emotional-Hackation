from openai import OpenAI
from typing import Optional

class LLM:
    def __init__(self, model: str = "gpt-4o-mini", api_key: Optional[str] = "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"):
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def ask(self, prompt: str) -> str:
        """Send a prompt and return the model's response."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {e}"

# Usage
# gpt = LLM()

# response = gpt.ask("Write a one-sentence bedtime story about a unicorn.")
# print(response)
