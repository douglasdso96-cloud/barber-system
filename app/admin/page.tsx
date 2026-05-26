'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Appointment {
  id: string
  client_name: string
  appointment_date: string
  appointment_time: string
  status: string
}

interface Service {
  id: string
  price: number
}

export default function AdminPage() {

  const router = useRouter()

  const [appointments, setAppointments] =
    useState<Appointment[]>([])

  const [services, setServices] =
    useState<Service[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const isLogged =
      document.cookie.includes('admin-auth=true')

    if (!isLogged) {
      router.push('/login')
      return
    }

    fetchDashboard()

  }, [])

  const fetchDashboard = async () => {

    const companyId =
      localStorage.getItem('company_id')

    const {
      data: appointmentsData
    } = await supabase
      .from('appointments')
      .select('*')
      .eq('company_id', companyId)

    const {
      data: servicesData
    } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', companyId)

    setAppointments(appointmentsData || [])
    setServices(servicesData || [])

    setLoading(false)
  }

  const handleLogout = async () => {

    document.cookie =
      'admin-auth=; path=/; max-age=0'

    localStorage.removeItem(
      'company_id'
    )

    await supabase.auth.signOut()

    router.push('/login')
  }

  const today =
    new Date().toISOString().split('T')[0]

  const todayAppointments =
    appointments.filter(
      (appointment) =>
        appointment.appointment_date === today &&
        appointment.status !== 'cancelled'
    )

  const confirmedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status !== 'cancelled'
    )

  const totalClients =
    new Set(
      appointments.map(
        (appointment) =>
          appointment.client_name
      )
    ).size

  const estimatedRevenue =
    confirmedAppointments.length *
    (services[0]?.price || 35)

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Painel administrativo da barbearia
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() =>
                router.push('/master')
              }
              className="bg-purple-500 hover:bg-purple-600 transition px-6 py-3 rounded-2xl font-bold"
            >
              Painel Master
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-2xl font-bold"
            >
              Sair
            </button>

          </div>

        </div>

        {loading ? (

          <div className="text-center py-20 text-2xl">
            Carregando...
          </div>

        ) : (

          <>

            <div className="grid md:grid-cols-4 gap-6 mb-10">

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

                <p className="text-zinc-400 mb-3">
                  Agendamentos
                </p>

                <h2 className="text-5xl font-bold">
                  {confirmedAppointments.length}
                </h2>

              </div>

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

                <p className="text-zinc-400 mb-3">
                  Hoje
                </p>

                <h2 className="text-5xl font-bold">
                  {todayAppointments.length}
                </h2>

              </div>

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

                <p className="text-zinc-400 mb-3">
                  Clientes
                </p>

                <h2 className="text-5xl font-bold">
                  {totalClients}
                </h2>

              </div>

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

                <p className="text-zinc-400 mb-3">
                  Faturamento
                </p>

                <h2 className="text-4xl font-bold text-green-500">
                  R$ {estimatedRevenue}
                </h2>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <Link
                href="/admin/services"
                className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-green-500 transition"
              >

                <h2 className="text-3xl font-bold mb-3">
                  Serviços
                </h2>

                <p className="text-zinc-400">
                  Gerencie os serviços da empresa
                </p>

              </Link>

              <Link
                href="/admin/professionals"
                className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-green-500 transition"
              >

                <h2 className="text-3xl font-bold mb-3">
                  Profissionais
                </h2>

                <p className="text-zinc-400">
                  Gerencie os profissionais
                </p>

              </Link>

              <Link
                href="/admin/appointments"
                className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-green-500 transition"
              >

                <h2 className="text-3xl font-bold mb-3">
                  Agendamentos
                </h2>

                <p className="text-zinc-400">
                  Visualize horários e clientes
                </p>

              </Link>

              <Link
                href="/master"
                className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 hover:border-purple-500 transition"
              >

                <h2 className="text-3xl font-bold mb-3">
                  Painel Master
                </h2>

                <p className="text-zinc-400">
                  Gerencie todas as empresas
                </p>

              </Link>

            </div>

          </>

        )}

      </div>

    </main>
  )
}