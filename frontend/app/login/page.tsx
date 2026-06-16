import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}>
        <button type="submit">Entrar com Google</button>
      </form>
    </div>
  )
}