'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

export default function ServicesPage() {
  const router = useRouter()

  const [services, setServices] = useState<Service[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLogged = document.cookie.includes('admin-auth=true')

    if (!isLogged) {
      router.push('/login')
      return
    }

    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      setLoading(false)
      return
    }

    setServices(data || [])
    setLoading(false)
  }

  const createService = async () => {
    if (!name || !price || !duration) {
      alert('Preencha todos os campos')
      return
    }

    const { error } = await supabase.from('services').insert([
      {
        name,
        price,
        duration
      }
    ])

    if (error) {
      console.log(error)
      alert('Erro ao criar serviço')
      return
    }

    setName('')
    setPrice('')
    setDuration('')
    fetchServices()
  }

  const deleteService = async (id: string) => {
    const confirmDelete = confirm('Deseja excluir este serviço?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao excluir')
      return
    }

    fetchServices()
  }

  const handleLogout = async () => {
    document.cookie = 'admin-auth=; path=/; max-age=0'
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold mb-2">Serviços</h1>
            <p className="text-zinc-400">Gerencie os serviços da empresa</p>
          </div>

          <button
            onClick={() => router.push('/admin')}
            className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-3 rounded-2xl font-bold"
          >
            Voltar
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-2xl">Carregando...</div>
        ) : (
          <>
            <div className="bg-zinc-900 rounded-3xl p-8 mb-10">
              <h2 className="text-3xl font-bold mb-6">Novo Serviço</h2>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nome do serviço"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
                />

                <input
                  type="number"
                  placeholder="Preço"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
                />

                <input
                  type="text"
                  placeholder="Duração"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
                />
              </div>

              <button
                onClick={createService}
                className="mt-6 bg-green-500 hover:bg-green-600 transition px-8 py-4 rounded-2xl text-xl font-bold"
              >
                Criar Serviço
              </button>
            </div>

            <div className="grid gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-zinc-900 rounded-3xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">
                        {service.name}
                      </h3>

                      <p className="text-zinc-400 text-lg">
                        💰 R$ {service.price}
                      </p>

                      <p className="text-zinc-400 text-lg">
                        ⏱️ {service.duration}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteService(service.id)}
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