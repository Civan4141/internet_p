import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      appointments: {
        include: {
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
        take: 5,
      },
      _count: {
        select: {
          appointments: true,
          messagesSent: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-white">Hoş geldin, {session.user?.name}</span>
              <Link
                href="/appointments"
                className="text-white hover:text-purple-300 transition-colors"
              >
                Randevularım
              </Link>
              {session.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href="/auth/signout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Çıkış Yap
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-purple-300">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Toplam Randevu</h3>
                  <p className="text-2xl font-bold text-purple-300">{user._count.appointments}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Gönderilen Mesaj</h3>
                  <p className="text-2xl font-bold text-purple-300">{user._count.messagesSent}</p>
                </div>
              </div>

              {user.profile?.bio && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">Hakkımda</h2>
                  <p className="text-gray-300">{user.profile.bio}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <Link
                  href="/profile/edit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Profili Düzenle
                </Link>
                <Link
                  href="/appointments/create"
                  className="bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Yeni Randevu
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Appointments */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Son Randevular</h3>
              <div className="space-y-3">
                {user.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{appointment.artist.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(appointment.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="text-xs text-purple-300">
                      {appointment.artist.specialty} - {appointment.time}
                    </div>
                  </div>
                ))}
                {user.appointments.length === 0 && (
                  <p className="text-gray-400 text-sm">Henüz randevu yok</p>
                )}
              </div>
              <Link
                href="/appointments"
                className="block text-center text-purple-300 hover:text-purple-200 text-sm mt-4"
              >
                Tüm randevuları görüntüle →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <Link
                  href="/appointments/create"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm text-center transition-colors"
                >
                  Yeni Randevu Oluştur
                </Link>
                <Link
                  href="/artists"
                  className="block w-full bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md text-sm text-center transition-colors"
                >
                  Sanatçıları Gör
                </Link>
                <Link
                  href="/messages"
                  className="block w-full bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md text-sm text-center transition-colors"
                >
                  Mesajları Görüntüle
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">İletişim Bilgileri</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white ml-2">{user.email}</span>
                </div>
                {user.profile?.phone && (
                  <div className="text-sm">
                    <span className="text-gray-300">Telefon:</span>
                    <span className="text-white ml-2">{user.profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
