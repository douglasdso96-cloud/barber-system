'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

interface Professional {
  id: string
  name: string
  specialty: string
}

export default function ProfessionalsPage() {

  const router = useRouter()

  const [professionals, setProfessionals] = useState<Professional[]>([])

  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const isLogged =
      document.cookie.includes('admin-auth=true')

    if (!isLogged) {
      router.push('/login')
      return
    }

    fetchProfessionals()

  }, [])

  const fetchProfessionals = async () => {

    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      setLoading(false)
      return
    }

    setProfessionals(data || [])
    setLoading(false)
  }

  const createProfessional = async () => {

    if (!name || !specialty) {
      alert('Preencha todos os campos')
      return
    }

    const { error } = await supabase
      .from('professionals')
      .insert([
        {
          name,
          specialty
        }
      ])

    if (error) {
      console.log(error)
      alert('Erro ao criar profissional')
      return
    }

    setName('')
    setSpecialty('')

    fetchProfessionals()
  }

  const deleteProfessional = async (id: string) => {

    const confirmDelete = confirm(
      'Deseja excluir este profissional?'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir')
      return
    }

    fetchProfessionals()
  }

  const handleLogout = async () => {

    document.cookie =
      'admin-auth=; path=/; max-age=0'

    await supabase.auth.signOut()

    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-2">
              Profissionais
            </h1>

            <p className="text-zinc-400">
              Gerencie os profissionais da empresa
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

          <>

            <div className="bg-zinc-900 rounded-3xl p-8 mb-10">

              <h2 className="text-3xl font-bold mb-6">
                Novo Profissional
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Nome do profissional"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
                />

                <input
                  type="text"
                  placeholder="Especialidade"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
                />

              </div>

              <button
                onClick={createProfessional}
                className="mt-6 bg-green-500 hover:bg-green-600 transition px-8 py-4 rounded-2xl text-xl font-bold"
              >
                Criar Profissional
              </button>

            </div>

            <div className="grid gap-6">

              {professionals.map((professional) => (

                <div
                  key={professional.id}
                  className="bg-zinc-900 rounded-3xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div>

                      <h3 className="text-3xl font-bold mb-2">
                        {professional.name}
                      </h3>

                      <p className="text-zinc-400 text-lg">
                        ✂️ {professional.specialty}
                      </p>

                    </div>

                    <button
                      onClick={() => deleteProfessional(professional.id)}
                      className="bg-red-500 hover:bg-red-600 transition px-6 py-4 rounded-2xl text-lg font-bold"
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <button
              onClick={handleLogout}
              className="mt-10 bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-bold"
            >
              Sair
            </button>

          </>

        )}

      </div>

    </main>
  )
}