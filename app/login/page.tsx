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

    setLoading(true)

    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error || !data.user) {

      alert('Email ou senha inválidos')

      setLoading(false)

      return
    }

    const userId = data.user.id

    const {
      data: company,
      error: companyError
    } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (companyError || !company) {

      console.log(companyError)

      alert('Empresa não encontrada')

      setLoading(false)

      return
    }

    localStorage.setItem(
      'company_id',
      company.id
    )

    document.cookie =
      'admin-auth=true; path=/; max-age=86400; SameSite=Lax'

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-10">

        <h1 className="text-5xl font-bold mb-2 text-center">
          Login
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Acesse o painel administrativo
        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition p-5 rounded-2xl text-2xl font-bold"
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