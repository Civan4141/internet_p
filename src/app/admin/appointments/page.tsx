import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AppointmentActions from "./AppointmentActions";

export default async function AdminAppointments() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      artist: {
        select: {
          name: true,
          specialty: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300",
    confirmed: "bg-green-500/20 text-green-300",
    completed: "bg-blue-500/20 text-blue-300",
    cancelled: "bg-red-500/20 text-red-300",
  };

  const statusLabels = {
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-white hover:text-purple-300 mr-4">
                ← Admin Panel
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Randevular</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Hoş geldin, {session.user.name}
              </span>
              <Link
                href="/auth/signout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Çıkış Yap
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Randevular</h1>
            <p className="text-gray-300">
              Toplam {appointments.length} randevu
            </p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">
              Randevu Listesi
            </h3>
            <p className="text-gray-300 mt-1">
              Tüm randevuları buradan görüntüleyebilir ve yönetebilirsiniz.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="text-left py-3 px-6 text-white font-medium">Kullanıcı</th>
                  <th className="text-left py-3 px-6 text-white font-medium">Sanatçı</th>
                  <th className="text-left py-3 px-6 text-white font-medium">Tarih & Saat</th>
                  <th className="text-left py-3 px-6 text-white font-medium">Durum</th>
                  <th className="text-left py-3 px-6 text-white font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{appointment.user.name}</p>
                        <p className="text-gray-300 text-sm">{appointment.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{appointment.artist.name}</p>
                        <p className="text-gray-300 text-sm">{appointment.artist.specialty}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">
                          {new Date(appointment.date).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-gray-300 text-sm">{appointment.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          statusColors[appointment.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[appointment.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/appointments/${appointment.id}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Detay
                        </Link>
                        <AppointmentActions 
                          appointmentId={appointment.id}
                          status={appointment.status}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-white mb-2">Henüz randevu yok</h3>
            <p className="text-gray-300">
              Randevular buraya gelecek.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
