"use server"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
export async function getAnthropicModels() {
    const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
            "x-api-key": `${ANTHROPIC_API_KEY}`,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    console.log(data)
    return data
}