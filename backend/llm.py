from openai import OpenAI
client = OpenAI(
    api_key="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"
)

response = client.responses.create(
    model="gpt-4o-mini",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)