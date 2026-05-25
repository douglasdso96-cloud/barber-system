'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

interface Appointment {
  id: string
  client_name: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  status: string
}

export default function AppointmentsPage() {

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })

    if (error) {
      console.log(error)
      alert('Erro ao carregar agendamentos')
      return
    }

    setAppointments(data || [])
    setLoading(false)
  }

  const cancelAppointment = async (id: string) => {

    const confirmCancel = confirm(
      'Deseja cancelar este agendamento?'
    )

    if (!confirmCancel) return

    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled'
      })
      .eq('id', id)

    if (error) {
      console.log(error)
      alert('Erro ao cancelar')
      return
    }

    fetchAppointments()
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Agendamentos
            </h1>

            <p className="text-zinc-400 mt-2">
              Gerencie os horários da barbearia
            </p>

          </div>

          <Link
            href="/admin"
            className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-3 rounded-2xl font-bold"
          >
            Voltar
          </Link>

        </div>

        {loading ? (

          <div className="text-center py-20 text-2xl">
            Carregando...
          </div>

        ) : appointments.length === 0 ? (

          <div className="bg-zinc-900 rounded-3xl p-10 text-center text-zinc-400">
            Nenhum agendamento encontrado
          </div>

        ) : (

          <div className="grid gap-6">

            {appointments.map((appointment) => (

              <div
                key={appointment.id}
                className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div className="space-y-2">

                    <h2 className="text-2xl font-bold">
                      {appointment.client_name}
                    </h2>

                    <p className="text-zinc-400">
                      📞 {appointment.client_phone}
                    </p>

                    <p>
                      📅 {appointment.appointment_date}
                    </p>

                    <p>
                      ⏰ {appointment.appointment_time}
                    </p>

                    <div className="pt-2">

                      <span
                        className={`
                          px-4 py-2 rounded-full text-sm font-bold

                          ${appointment.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                          }
                        `}
                      >
                        {appointment.status === 'cancelled'
                          ? 'Cancelado'
                          : 'Confirmado'
                        }
                      </span>

                    </div>

                  </div>

                  {appointment.status !== 'cancelled' && (

                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-bold"
                    >
                      Cancelar
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  )
}