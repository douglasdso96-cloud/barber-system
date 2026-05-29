'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function EditCompanyPage() {

  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [name, setName] =
    useState('')

  const [slug, setSlug] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [whatsapp, setWhatsapp] =
    useState('')

  const [address, setAddress] =
    useState('')

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {

    const { data, error } =
      await supabase
        .from('companies')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !data) {

      alert('Empresa não encontrada')

      router.push('/master')

      return
    }

    setName(data.name || '')
    setSlug(data.slug || '')
    setEmail(data.email || '')
    setWhatsapp(data.whatsapp || '')
    setAddress(data.address || '')

    setLoading(false)
  }

  const handleSave = async () => {

    setSaving(true)

    const { error } =
      await supabase
        .from('companies')
        .update({
          name,
          slug,
          email,
          whatsapp,
          address
        })
        .eq('id', params.id)

    setSaving(false)

    if (error) {

      console.log(error)

      alert('Erro ao salvar')

      return
    }

    alert('Empresa atualizada com sucesso')

    router.push('/master')
  }

  if (loading) {

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Carregando...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Editar Empresa
        </h1>

        <div className="space-y-5">

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Nome"
            className="w-full bg-zinc-900 p-5 rounded-2xl"
          />

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            placeholder="Slug"
            className="w-full bg-zinc-900 p-5 rounded-2xl"
          />

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
            className="w-full bg-zinc-900 p-5 rounded-2xl"
          />

          <input
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(e.target.value)
            }
            placeholder="WhatsApp"
            className="w-full bg-zinc-900 p-5 rounded-2xl"
          />

          <input
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            placeholder="Endereço"
            className="w-full bg-zinc-900 p-5 rounded-2xl"
          />

          <div className="flex gap-4">

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 hover:bg-green-600 px-6 py-4 rounded-2xl font-bold"
            >
              {saving
                ? 'Salvando...'
                : 'Salvar'}
            </button>

            <button
              onClick={() =>
                router.push('/master')
              }
              className="bg-zinc-700 hover:bg-zinc-600 px-6 py-4 rounded-2xl font-bold"
            >
              Cancelar
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}