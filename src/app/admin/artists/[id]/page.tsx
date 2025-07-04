import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminArtistActions from "./AdminArtistActions";

interface ArtistDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArtistDetail({ params }: ArtistDetailProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const artist = await prisma.tattooArtist.findUnique({
    where: { id },
    include: {
      appointments: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sanatçı Bulunamadı</h1>
          <Link href="/admin/artists" className="text-purple-300 hover:text-purple-200">
            ← Sanatçılar listesine dön
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
    pending: "bg-yellow-500/20 text-yellow-300",
    confirmed: "bg-green-500/20 text-green-300",
    completed: "bg-blue-500/20 text-blue-300",
    cancelled: "bg-red-500/20 text-red-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/artists" className="text-white hover:text-purple-300 mr-4">
                ← Sanatçılar
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ {artist.name}</span>
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
          {/* Artist Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{artist.name}</h1>
                  <p className="text-purple-300 text-lg mb-2">{artist.specialty}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white">{artist.rating}</span>
                    </div>
                    <span className="text-gray-300">{artist.experience} yıl deneyim</span>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      artist.isActive 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {artist.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Temel Bilgiler</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Konum:</span>
                      <span className="text-white">{(artist as any).location || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Saatlik Ücret:</span>
                      <span className="text-white">₺{(artist as any).hourlyRate || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Toplam Randevu:</span>
                      <span className="text-white">{artist._count.appointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Kayıt Tarihi:</span>
                      <span className="text-white">
                        {artist.createdAt.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Hakkında</h3>
                  <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Randevular ({artist.appointments.length})
              </h3>
              {artist.appointments.length === 0 ? (
                <p className="text-gray-300 py-8 text-center">
                  Henüz randevu bulunmuyor.
                </p>
              ) : (
                <div className="space-y-4">
                  {artist.appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{appointment.user.name}</h4>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          statusColors[appointment.status as keyof typeof statusColors]
                        }`}>
                          {statusLabels[appointment.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>📧 {appointment.user.email}</p>
                        <p>📅 {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}</p>
                        {appointment.description && (
                          <p>📝 {appointment.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İşlemler</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/artists/${artist.id}/edit`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors block text-center"
                >
                  Düzenle
                </Link>
                <AdminArtistActions 
                  artistId={artist.id}
                  artistName={artist.name}
                  isActive={artist.isActive}
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Bekleyen Randevu:</span>
                  <span className="text-yellow-400">
                    {artist.appointments.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Onaylanmış:</span>
                  <span className="text-green-400">
                    {artist.appointments.filter(a => a.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tamamlanmış:</span>
                  <span className="text-blue-400">
                    {artist.appointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">İptal Edilmiş:</span>
                  <span className="text-red-400">
                    {artist.appointments.filter(a => a.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
