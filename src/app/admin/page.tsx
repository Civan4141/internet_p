import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  // İstatistikleri getir
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.tattooArtist.count(),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "pending" } }),
  ]);

  const [totalUsers, totalArtists, totalAppointments, pendingAppointments] = stats;

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
              <span className="ml-4 text-purple-300">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Hoş geldin, {session.user.name}
              </span>
              <Link
                href="/"
                className="text-white hover:text-purple-300 transition-colors"
              >
                Ana Sayfa
              </Link>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-300">
            Sistem yönetimi ve istatistikleri
          </p>
        </div>
          
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Kullanıcı</h3>
            <p className="text-3xl font-bold text-blue-400">{totalUsers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Sanatçı</h3>
            <p className="text-3xl font-bold text-green-400">{totalArtists}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Randevu</h3>
            <p className="text-3xl font-bold text-purple-400">{totalAppointments}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Bekleyen Randevu</h3>
            <p className="text-3xl font-bold text-orange-400">{pendingAppointments}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">👥</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Kullanıcılar</h3>
                <p className="text-gray-300">
                  Kullanıcıları yönet, rol değiştir
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/artists"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">🎨</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Sanatçılar</h3>
                <p className="text-gray-300">
                  Dövme sanatçılarını yönet
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/appointments"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">📅</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Randevular</h3>
                <p className="text-gray-300">
                  Randevuları görüntüle ve yönet
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/messages"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">💬</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Mesajlar</h3>
                <p className="text-gray-300">
                  Kullanıcı mesajlarını görüntüle
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">📊</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">İstatistikler</h3>
                <p className="text-gray-300">
                  Detaylı analiz ve raporlar
                </p>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
