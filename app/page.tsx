import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-6xl font-bold mb-6">
          Barber SaaS
        </h1>

        <p className="text-zinc-400 text-lg mb-8">
          Sistema inteligente para agendamento de barbearias
        </p>

        <Link
          href="/register"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition inline-block"
        >
          Começar Agora
        </Link>

      </div>
    </main>
  )
}