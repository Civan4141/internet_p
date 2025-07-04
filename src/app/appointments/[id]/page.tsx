import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CancelAppointmentButton from "./CancelAppointmentButton";

interface AppointmentDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetail({ params }: AppointmentDetailProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
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
          <Link href="/appointments" className="text-purple-300 hover:text-purple-200">
            ← Randevularım listesine dön
          </Link>
        </div>
      </div>
    );
  }

  // Sadece kendi randevusunu veya admin görebilir
  if (appointment.userId !== session.user.id && session.user.role !== "admin") {
    redirect("/appointments");
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
              <Link href="/appointments" className="text-white hover:text-purple-300 mr-4">
                ← Randevularım
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Randevu Detayı</span>
            </div>
            <div className="flex items-center space-x-4">
              {session.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <span className="text-white">Hoş geldin, {session.user.name}</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Status */}
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
                  <h3 className="text-lg font-semibold text-white mb-3">Randevu Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-white font-medium">
                          {new Date(appointment.date).toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-300 text-sm">Tarih</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🕒</span>
                      <div>
                        <p className="text-white font-medium">{appointment.time}</p>
                        <p className="text-gray-300 text-sm">Saat</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p className="text-white font-medium">#{appointment.id.substring(0, 8)}...</p>
                        <p className="text-gray-300 text-sm">Randevu No</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Oluşturulma</h3>
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
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link
                  href={`/artists/${appointment.artist.id}`}
                  className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <span>Sanatçı profilini görüntüle</span>
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            {/* Description & Notes */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Açıklama ve Notlar</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Açıklamanız</h4>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300">
                      {appointment.description || "Açıklama belirtilmemiş."}
                    </p>
                  </div>
                </div>
                {appointment.notes && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Sanatçı Notları</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-gray-300">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İşlemler</h3>
              <div className="space-y-3">
                <Link
                  href={`/messages/${appointment.artist.id}`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors block text-center"
                >
                  Sanatçı ile Mesajlaş
                </Link>
                
                <CancelAppointmentButton 
                  appointmentId={appointment.id} 
                  status={appointment.status} 
                />
                
                {appointment.status === 'confirmed' && (
                  <div className="text-center">
                    <p className="text-green-400 text-sm mb-2">✅ Randevunuz onaylandı!</p>
                    <p className="text-gray-300 text-xs">
                      Randevu tarihinde sanatçı ile buluşun.
                    </p>
                  </div>
                )}
                
                {appointment.status === 'completed' && (
                  <div className="text-center">
                    <p className="text-blue-400 text-sm mb-2">🎉 Randevunuz tamamlandı!</p>
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors">
                      Değerlendirme Yap
                    </button>
                  </div>
                )}
                
                {appointment.status === 'cancelled' && (
                  <div className="text-center">
                    <p className="text-red-400 text-sm">❌ Randevu iptal edildi</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm">Sanatçı</p>
                  <p className="text-white font-medium">{appointment.artist.name}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Uzmanlık</p>
                  <p className="text-white">{appointment.artist.specialty}</p>
                </div>
                {session.user.role === "admin" && (
                  <div>
                    <p className="text-gray-300 text-sm">Müşteri</p>
                    <p className="text-white">{appointment.user.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Yardım</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white font-medium">Randevu değişikliği</p>
                  <p className="text-gray-300">Sanatçı ile mesajlaşarak randevu saatinizi değiştirebilirsiniz.</p>
                </div>
                <div>
                  <p className="text-white font-medium">İptal politikası</p>
                  <p className="text-gray-300">Randevudan 24 saat önce ücretsiz iptal edebilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
