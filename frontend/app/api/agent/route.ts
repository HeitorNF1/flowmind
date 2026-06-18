import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await req.json()

  const functionUrl = process.env.AZURE_FUNCTION_URL ?? "http://localhost:7071/api/agent"

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      sessionId: session.user?.email,
    }),
  })

  const data = await response.json()
  return NextResponse.json(data)
}