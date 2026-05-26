'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function RegisterPage() {

  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')

  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {

    if (
      !name ||
      !slug ||
      !email ||
      !password ||
      !whatsapp ||
      !address
    ) {
      alert('Preencha todos os campos')
      return
    }

    setLoading(true)

    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password
    })

    if (error || !data.user) {

      console.log(error)

      alert('Erro ao criar conta')

      setLoading(false)

      return
    }

    const userId = data.user.id

    const {
      data: companyData,
      error: companyError
    } = await supabase
      .from('companies')
      .insert([
        {
          name,
          slug,
          whatsapp,
          address,
          email,
          user_id: userId
        }
      ])
      .select()
      .single()

    if (companyError) {

      console.log(companyError)

      alert('Erro ao criar empresa')

      setLoading(false)

      return
    }

    localStorage.setItem(
      'company_id',
      companyData.id
    )

    document.cookie =
      'admin-auth=true; path=/; max-age=86400; SameSite=Lax'

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-zinc-900 rounded-3xl p-10">

        <h1 className="text-5xl font-bold mb-3 text-center">
          Criar Barbearia
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Crie sua conta na plataforma
        </p>

        <div className="grid gap-5">

          <input
            type="text"
            placeholder="Nome da barbearia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="text"
            placeholder="Link da barbearia"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 text-white"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 transition p-5 rounded-2xl text-2xl font-bold"
          >

            {loading
              ? 'Criando...'
              : 'Criar Barbearia'
            }

          </button>

        </div>

      </div>

    </main>
  )
}