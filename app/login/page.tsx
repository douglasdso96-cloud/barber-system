'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {

    if (!email || !password) {
      alert('Preencha email e senha')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log(error)
      alert('Email ou senha inválidos')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-10 border border-zinc-800">

        <h1 className="text-5xl font-bold mb-3 text-center">
          Login
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Acesse o painel administrativo
        </p>

        <div className="grid gap-4">

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 transition rounded-2xl p-4 text-xl font-bold mt-4"
          >

            {loading
              ? 'Entrando...'
              : 'Entrar'
            }

          </button>

        </div>

      </div>

    </main>
  )
}