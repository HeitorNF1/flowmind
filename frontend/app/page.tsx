import { auth, signOut } from "@/auth"

export default async function HomePage() {
  const session = await auth()

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem vindo, {session?.user?.name}!</h1>
      <p>{session?.user?.email}</p>
      <form action={async () => {
        "use server"
        await signOut({ redirectTo: "/login" })
      }}>
        <button type="submit">Sairrr</button>
      </form>
    </div>
  )
}