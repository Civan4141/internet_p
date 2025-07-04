import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminAppointmentActions from "./AdminAppointmentActions";

interface AppointmentDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAppointmentDetail({ params }: AppointmentDetailProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      artist: true,
    },
  });

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Randevu Bulunamadı</h1>
          <Link href="/admin/appointments" className="text-purple-300 hover:text-purple-200">
            ← Randevular listesine dön
          </Link>
        </div>
      </div>
    );
  }

  const statusLabels = {
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
  };

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/appointments" className="text-white hover:text-purple-300 mr-4">
                ← Randevular
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Randevu Detayı</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Hoş geldin, {session.user.name}
              </span>
              <Link
                href="/api/auth/signout"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointment Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Randevu Detayı</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  statusColors[appointment.status as keyof typeof statusColors]
                }`}>
                  {statusLabels[appointment.status as keyof typeof statusLabels]}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tarih ve Saat</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📅</span>
                      <span className="text-white font-medium">
                        {new Date(appointment.date).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🕒</span>
                      <span className="text-white font-medium">{appointment.time}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Randevu Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Oluşturulma:</span>
                      <span className="text-white">
                        {appointment.createdAt.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Son Güncelleme:</span>
                      <span className="text-white">
                        {appointment.updatedAt.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Müşteri Bilgileri</h3>
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {appointment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-white">{appointment.user.name}</h4>
                  <p className="text-gray-300">{appointment.user.email}</p>
                  {appointment.user.profile?.phone && (
                    <p className="text-gray-300">📞 {appointment.user.profile.phone}</p>
                  )}
                </div>
              </div>
              {appointment.user.profile?.bio && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Hakkında</h4>
                  <p className="text-gray-300">{appointment.user.profile.bio}</p>
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Sanatçı Bilgileri</h3>
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {appointment.artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-white">{appointment.artist.name}</h4>
                  <p className="text-gray-300">{appointment.artist.specialty}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white">{appointment.artist.rating}</span>
                    <span className="text-gray-300">• {appointment.artist.experience} yıl deneyim</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300">{appointment.artist.bio}</p>
            </div>

            {/* Description & Notes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Açıklama ve Notlar</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Müşteri Açıklaması</h4>
                  <p className="text-gray-300 bg-white/5 rounded-lg p-4">
                    {appointment.description || "Açıklama belirtilmemiş."}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Admin/Sanatçı Notları</h4>
                  <p className="text-gray-300 bg-white/5 rounded-lg p-4">
                    {appointment.notes || "Not bulunmuyor."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <AdminAppointmentActions 
                appointmentId={appointment.id}
                status={appointment.status}
                notes={appointment.notes}
              />
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href={`/messages/${appointment.user.id}`}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors block text-center"
                >
                  Müşteri ile Mesajlaş
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hızlı Bilgiler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Randevu ID:</span>
                  <span className="text-white text-xs font-mono">{appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Müşteri ID:</span>
                  <span className="text-white text-xs font-mono">{appointment.user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sanatçı ID:</span>
                  <span className="text-white text-xs font-mono">{appointment.artist.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Durum Geçmişi</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white text-sm">Randevu Oluşturuldu</span>
                </div>
                <div className="text-xs text-gray-400 ml-5">
                  {appointment.createdAt.toLocaleString('tr-TR')}
                </div>
                
                {appointment.status !== 'pending' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-500' :
                        appointment.status === 'completed' ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-white text-sm">
                        {statusLabels[appointment.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 ml-5">
                      {appointment.updatedAt.toLocaleString('tr-TR')}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
