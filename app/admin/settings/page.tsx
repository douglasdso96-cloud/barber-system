'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function SettingsPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')

  const [openingTime, setOpeningTime] = useState('08:00')
  const [closingTime, setClosingTime] = useState('18:00')
  const [slotInterval, setSlotInterval] = useState(30)

  const [monday, setMonday] = useState(true)
  const [tuesday, setTuesday] = useState(true)
  const [wednesday, setWednesday] = useState(true)
  const [thursday, setThursday] = useState(true)
  const [friday, setFriday] = useState(true)
  const [saturday, setSaturday] = useState(true)
  const [sunday, setSunday] = useState(false)

  useEffect(() => {

    const isLogged =
      document.cookie.includes('admin-auth=true')

    if (!isLogged) {
      router.push('/login')
      return
    }

    fetchCompany()

  }, [])

  const fetchCompany = async () => {

    const companyId =
      localStorage.getItem('company_id')

    if (!companyId) {
      alert('Empresa não encontrada')
      router.push('/admin')
      return
    }

    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error || !data) {

      console.log(error)

      alert('Erro ao carregar empresa')

      return
    }

    setName(data.name || '')
    setEmail(data.email || '')
    setWhatsapp(data.whatsapp || '')
    setAddress(data.address || '')

    setOpeningTime(data.opening_time || '08:00')
    setClosingTime(data.closing_time || '18:00')
    setSlotInterval(data.slot_interval || 30)

    setMonday(data.monday ?? true)
    setTuesday(data.tuesday ?? true)
    setWednesday(data.wednesday ?? true)
    setThursday(data.thursday ?? true)
    setFriday(data.friday ?? true)
    setSaturday(data.saturday ?? true)
    setSunday(data.sunday ?? false)

    setLoading(false)
  }

  const handleSave = async () => {

    const companyId =
      localStorage.getItem('company_id')

    if (!companyId) return

    setSaving(true)

    const { error } = await supabase
      .from('companies')
      .update({
        name,
        email,
        whatsapp,
        address,

        opening_time: openingTime,
        closing_time: closingTime,
        slot_interval: slotInterval,

        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
      })
      .eq('id', companyId)

    setSaving(false)

    if (error) {

      console.log(error)

      alert('Erro ao salvar')

      return
    }

    alert('Configurações salvas com sucesso')
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

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <h1 className="text-5xl font-bold">
            Configurações
          </h1>

          <button
            onClick={() => router.push('/admin')}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-2xl font-bold"
          >
            Voltar
          </button>

        </div>

        <div className="space-y-8">

          <div className="bg-zinc-900 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Dados da Empresa
            </h2>

            <div className="grid gap-4">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Nome"
                className="bg-zinc-800 rounded-2xl p-4"
              />

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email"
                className="bg-zinc-800 rounded-2xl p-4"
              />

              <input
                value={whatsapp}
                onChange={(e) =>
                  setWhatsapp(e.target.value)
                }
                placeholder="WhatsApp"
                className="bg-zinc-800 rounded-2xl p-4"
              />

              <input
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Endereço"
                className="bg-zinc-800 rounded-2xl p-4"
              />

            </div>

          </div>

          <div className="bg-zinc-900 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Horários
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              <input
                type="time"
                value={openingTime}
                onChange={(e) =>
                  setOpeningTime(e.target.value)
                }
                className="bg-zinc-800 rounded-2xl p-4"
              />

              <input
                type="time"
                value={closingTime}
                onChange={(e) =>
                  setClosingTime(e.target.value)
                }
                className="bg-zinc-800 rounded-2xl p-4"
              />

              <input
                type="number"
                value={slotInterval}
                onChange={(e) =>
                  setSlotInterval(Number(e.target.value))
                }
                className="bg-zinc-800 rounded-2xl p-4"
              />

            </div>

          </div>

          <div className="bg-zinc-900 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Dias de Funcionamento
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <label><input type="checkbox" checked={monday} onChange={() => setMonday(!monday)} /> Segunda</label>
              <label><input type="checkbox" checked={tuesday} onChange={() => setTuesday(!tuesday)} /> Terça</label>
              <label><input type="checkbox" checked={wednesday} onChange={() => setWednesday(!wednesday)} /> Quarta</label>
              <label><input type="checkbox" checked={thursday} onChange={() => setThursday(!thursday)} /> Quinta</label>
              <label><input type="checkbox" checked={friday} onChange={() => setFriday(!friday)} /> Sexta</label>
              <label><input type="checkbox" checked={saturday} onChange={() => setSaturday(!saturday)} /> Sábado</label>
              <label><input type="checkbox" checked={sunday} onChange={() => setSunday(!sunday)} /> Domingo</label>

            </div>

          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-500 hover:bg-green-600 p-5 rounded-2xl text-2xl font-bold"
          >

            {saving
              ? 'Salvando...'
              : 'Salvar Configurações'
            }

          </button>

        </div>

      </div>

    </main>
  )
}