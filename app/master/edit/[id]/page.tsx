'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Company {
  id: string
  name: string
  slug: string
  whatsapp: string
  address: string
  email: string
}

export default function MasterPage() {
  const router = useRouter()

  const [companies, setCompanies] =
    useState<Company[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    validateAdmin()
  }, [])

  const validateAdmin = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: admin } =
      await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!admin) {

      alert(
        'Acesso permitido apenas para administradores.'
      )

      router.push('/admin')

      return
    }

    fetchCompanies()
  }

  const fetchCompanies = async () => {

    const { data, error } =
      await supabase
        .from('companies')
        .select('*')
        .order('created_at', {
          ascending: false
        })

    if (error) {
      console.log(error)
      return
    }

    setCompanies(data || [])
    setLoading(false)
  }

  const deleteCompany = async (
    id: string
  ) => {

    const confirmDelete = confirm(
      'Deseja excluir esta empresa?'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir')
      return
    }

    fetchCompanies()
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3">
              Painel Master
            </h1>

            <p className="text-zinc-400">
              Gerencie todas as barbearias
            </p>

          </div>

          <button
            onClick={() => router.push('/admin')}
            className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-3 rounded-2xl font-bold"
          >
            Voltar
          </button>

        </div>

        {loading ? (

          <div className="text-center py-20 text-2xl">
            Carregando...
          </div>

        ) : (

          <div className="grid gap-6">

            {companies.map((company) => (

              <div
                key={company.id}
                className="bg-zinc-900 rounded-3xl p-8"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>

                    <h2 className="text-3xl font-bold mb-3">
                      {company.name}
                    </h2>

                    <p className="text-zinc-400 text-lg">
                      🔗 /{company.slug}
                    </p>

                    <p className="text-zinc-400 text-lg">
                      📧 {company.email}
                    </p>

                    <p className="text-zinc-400 text-lg">
                      📞 {company.whatsapp}
                    </p>

                    <p className="text-zinc-400 text-lg">
                      📍 {company.address}
                    </p>

                  </div>

                  <div className="flex gap-4">

                    <button
                      onClick={() =>
                        router.push(
                          `/master/edit/${company.id}`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 transition px-6 py-4 rounded-2xl text-lg font-bold"
                    >
                      Editar Empresa
                    </button>

                    <button
                      onClick={() =>
                        deleteCompany(company.id)
                      }
                      className="bg-red-500 hover:bg-red-600 transition px-6 py-4 rounded-2xl text-lg font-bold"
                    >
                      Excluir Empresa
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  )
}