"use server"

const EVAL_URL = process.env.EVAL_URL

export async function getJobs() {
    const res = await fetch(`${EVAL_URL}/jobs`)
    const data = await res.json()
    console.log(data)
    return data
}