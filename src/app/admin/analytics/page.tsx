import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminAnalytics() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  // İstatistikleri getir
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.tattooArtist.count(),
    prisma.appointment.count(),
    prisma.message.count(),
    prisma.appointment.count({ where: { status: "pending" } }),
    prisma.appointment.count({ where: { status: "confirmed" } }),
    prisma.appointment.count({ where: { status: "completed" } }),
    prisma.appointment.count({ where: { status: "cancelled" } }),
    prisma.message.count({ where: { isRead: false } }),
  ]);

  const [
    totalUsers,
    totalArtists,
    totalAppointments,
    totalMessages,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    unreadMessages,
  ] = stats;

  // Son 30 gün içindeki kayıtları getir
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentStats = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.appointment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.message.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const [newUsers, newAppointments, newMessages] = recentStats;

  // En aktif sanatçıları getir
  const topArtists = await prisma.tattooArtist.findMany({
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      appointments: {
        _count: "desc",
      },
    },
    take: 5,
  });

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
              <span className="ml-4 text-purple-300">/ İstatistikler</span>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">İstatistikler</h1>
          <p className="text-xl text-gray-300">
            Detaylı sistem analizi ve raporlar
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Kullanıcı</h3>
            <p className="text-3xl font-bold text-blue-400">{totalUsers}</p>
            <p className="text-sm text-green-400 mt-1">+{newUsers} son 30 gün</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Sanatçı</h3>
            <p className="text-3xl font-bold text-green-400">{totalArtists}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Randevu</h3>
            <p className="text-3xl font-bold text-purple-400">{totalAppointments}</p>
            <p className="text-sm text-green-400 mt-1">+{newAppointments} son 30 gün</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Mesaj</h3>
            <p className="text-3xl font-bold text-orange-400">{totalMessages}</p>
            <p className="text-sm text-green-400 mt-1">+{newMessages} son 30 gün</p>
          </div>
        </div>

        {/* Appointment Status Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              Randevu Durumları
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Bekleyen</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(pendingAppointments / totalAppointments) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{pendingAppointments}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Onaylanmış</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(confirmedAppointments / totalAppointments) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{confirmedAppointments}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Tamamlanmış</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(completedAppointments / totalAppointments) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{completedAppointments}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">İptal Edilmiş</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(cancelledAppointments / totalAppointments) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{cancelledAppointments}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              En Aktif Sanatçılar
            </h3>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div key={artist.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{artist.name}</p>
                      <p className="text-gray-300 text-sm">{artist.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{artist._count.appointments}</p>
                    <p className="text-gray-300 text-sm">randevu</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              Mesaj İstatistikleri
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Toplam Mesaj</span>
                <span className="text-white font-medium">{totalMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Okunmamış Mesaj</span>
                <span className="text-orange-400 font-medium">{unreadMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Okunma Oranı</span>
                <span className="text-green-400 font-medium">
                  {totalMessages > 0 ? Math.round(((totalMessages - unreadMessages) / totalMessages) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">
              Sistem Durumu
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Aktif Sanatçı</span>
                <span className="text-green-400 font-medium">{totalArtists}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Günlük Ortalama Randevu</span>
                <span className="text-blue-400 font-medium">
                  {Math.round(newAppointments / 30)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Başarı Oranı</span>
                <span className="text-green-400 font-medium">
                  {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
