'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Company {
  id: string
  name: string
  slug: string
  whatsapp: string
  address: string
}

interface Service {
  id: string
  name: string
  price: number
  duration: string
}

interface Professional {
  id: string
  name: string
  specialty: string
}

export default function CompanyPage() {

  const [companyData, setCompanyData] = useState<Company | null>(null)

  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  const [selectedService, setSelectedService] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const [bookedTimes, setBookedTimes] = useState<string[]>([])

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {

    try {

      const slug = window.location.pathname
        .replace('/', '')
        .trim()

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)

      if (error) {
        console.log(error)
        return
      }

      if (!data || data.length === 0) {
        alert('Empresa não encontrada')
        return
      }

      setCompanyData(data[0])

      fetchServices(data[0].id)
      fetchProfessionals(data[0].id)

    } catch (err) {

      console.log(err)

    }
  }

  const fetchServices = async (companyId: string) => {

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setServices(data || [])
  }

  const fetchProfessionals = async (companyId: string) => {

    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setProfessionals(data || [])
  }

  const fetchBookedTimes = async (date: string) => {

    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .neq('status', 'cancelled')

    if (error) {
      console.log(error)
      return
    }

    const formattedTimes = data.map(
      (item) => item.appointment_time.slice(0, 5)
    )

    setBookedTimes(formattedTimes)
  }

  const times = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '14:00',
    '14:30',
    '15:00'
  ]

  const handleAppointment = async () => {

    if (
      !selectedService ||
      !selectedProfessional ||
      !selectedDate ||
      !selectedTime ||
      !clientName ||
      !clientPhone
    ) {
      alert('Preencha todos os campos')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          client_name: clientName,
          client_phone: clientPhone,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          status: 'scheduled',
          company_id: companyData?.id
        }
      ])

    if (error) {
      console.log(error)
      alert('Erro ao salvar agendamento')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (!companyData) {

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-4xl font-bold">
          Carregando empresa...
        </h1>

      </main>
    )
  }

  if (success) {

    const whatsappMessage = `
Olá! Acabei de agendar um horário.

📅 Data: ${selectedDate}
⏰ Hora: ${selectedTime}
✂️ Serviço: ${selectedService}

👤 Cliente: ${clientName}
📞 Telefone: ${clientPhone}
`

    const whatsappLink =
      `https://wa.me/${companyData.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`

    return (
      <main className="min-h-screen bg-black text-white p-6">

        <div className="max-w-3xl mx-auto">

          <h1 className="text-5xl font-bold mb-2">
            {companyData.name}
          </h1>

          <p className="text-zinc-400 mb-10">
            Agende seu horário online
          </p>

          <div className="bg-zinc-900 rounded-3xl p-10 text-center">

            <h2 className="text-5xl font-bold text-green-500 mb-6">
              Agendamento Confirmado
            </h2>

            <div className="text-7xl mb-6">
              ✅
            </div>

            <div className="space-y-4 text-xl mb-10">

              <p>
                <strong>Cliente:</strong> {clientName}
              </p>

              <p>
                <strong>Serviço:</strong> {selectedService}
              </p>

              <p>
                <strong>Profissional:</strong> {selectedProfessional}
              </p>

              <p>
                <strong>Data:</strong> {selectedDate}
              </p>

              <p>
                <strong>Horário:</strong> {selectedTime}
              </p>

            </div>

            <a
              href={whatsappLink}
              target="_blank"
              className="inline-block bg-green-500 hover:bg-green-600 transition px-8 py-5 rounded-2xl text-2xl font-bold"
            >

              Confirmar no WhatsApp

            </a>

          </div>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          {companyData.name}
        </h1>

        <p className="text-zinc-400 mb-2">
          {companyData.address}
        </p>

        <p className="text-zinc-400 mb-10">
          WhatsApp: {companyData.whatsapp}
        </p>

        <div className="grid gap-10">

          <section>

            <h2 className="text-3xl font-bold mb-6">
              Escolha o Serviço
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {services.map((service) => (

                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.name)}
                  className={`
                    p-6 rounded-3xl border transition text-left

                    ${selectedService === service.name
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                    }
                  `}
                >

                  <h3 className="text-2xl font-bold mb-2">
                    {service.name}
                  </h3>

                  <p className="text-zinc-400">
                    {service.duration}
                  </p>

                  <p className="text-green-500 text-xl font-bold mt-4">
                    💰 R$ {service.price}
                  </p>

                </button>

              ))}

            </div>

          </section>

          <section>

            <h2 className="text-3xl font-bold mb-6">
              Escolha o Profissional
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {professionals.map((professional) => (

                <button
                  key={professional.id}
                  onClick={() => setSelectedProfessional(professional.name)}
                  className={`
                    p-6 rounded-3xl border transition text-left

                    ${selectedProfessional === professional.name
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                    }
                  `}
                >

                  <h3 className="text-2xl font-bold mb-2">
                    {professional.name}
                  </h3>

                  <p className="text-zinc-400">
                    ✂️ {professional.specialty}
                  </p>

                </button>

              ))}

            </div>

          </section>

          <section>

            <h2 className="text-3xl font-bold mb-6">
              Escolha a Data
            </h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                fetchBookedTimes(e.target.value)
              }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white"
            />

          </section>

          <section>

            <h2 className="text-3xl font-bold mb-6">
              Escolha o Horário
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {times.map((time) => {

                const isBooked = bookedTimes.includes(time)

                return (

                  <button
                    key={time}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      p-4 rounded-2xl font-bold transition

                      ${isBooked
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : selectedTime === time
                          ? 'bg-white text-black'
                          : 'bg-zinc-900 hover:bg-zinc-800'
                      }
                    `}
                  >

                    {isBooked ? 'Ocupado' : time}

                  </button>

                )
              })}

            </div>

          </section>

          <section className="bg-zinc-900 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-6">
              Seus Dados
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Seu nome"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
              />

              <input
                type="text"
                placeholder="Seu telefone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
              />

            </div>

          </section>

          <section className="bg-zinc-900 rounded-3xl p-8">

            <h2 className="text-4xl font-bold mb-8">
              Confirmar Agendamento
            </h2>

            <div className="space-y-4 text-2xl mb-10">

              <p>
                <strong>Serviço:</strong> {selectedService}
              </p>

              <p>
                <strong>Profissional:</strong> {selectedProfessional}
              </p>

              <p>
                <strong>Data:</strong> {selectedDate}
              </p>

              <p>
                <strong>Horário:</strong> {selectedTime}
              </p>

            </div>

            <button
              onClick={handleAppointment}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 transition p-5 rounded-2xl text-2xl font-bold"
            >

              {loading
                ? 'Agendando...'
                : 'Confirmar Agendamento'
              }

            </button>

          </section>

        </div>

      </div>

    </main>
  )
}