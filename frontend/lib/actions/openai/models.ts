"use server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export async function getOpenaiModels() {
    const res = await fetch("https://api.openai.com/v1/models", {
        headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    console.log(data)
    return data
}