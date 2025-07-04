import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

export default async function ArtistProfile({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const artist = await prisma.tattooArtist.findUnique({
    where: { id },
    include: {
      appointments: {
        include: {
          user: {
            select: {
              name: true,
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
        },
      },
    },
  });

  if (!artist) {
    redirect("/artists");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/artists" className="text-white hover:text-purple-300 mr-4">
                ← Sanatçılar
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-white">Hoş geldin, {session.user?.name}</span>
                  <Link
                    href="/profile"
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    Profil
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
                    href="/api/auth/signout"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Çıkış Yap
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artist Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-8">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{artist.name}</h1>
                  <p className="text-purple-300 text-lg mb-2">{artist.specialty}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white">{artist.rating}</span>
                    </div>
                    <span className="text-gray-300">{artist.experience} yıl deneyim</span>
                    <span className="text-gray-300">{artist._count.appointments} randevu</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Hakkında</h2>
                <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
              </div>

              {session && (
                <div className="flex space-x-4">
                  <Link
                    href={`/appointments/create?artistId=${artist.id}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Randevu Oluştur
                  </Link>
                  <Link
                    href={`/messages/new?toId=${artist.id}`}
                    className="bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Mesaj Gönder
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Appointments */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Son Randevular</h3>
              <div className="space-y-3">
                {artist.appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{appointment.user.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {appointment.date.toLocaleDateString('tr-TR')} - {appointment.time}
                    </div>
                  </div>
                ))}
                {artist.appointments.length === 0 && (
                  <p className="text-gray-400 text-sm">Henüz randevu yok</p>
                )}
              </div>
            </div>

            {/* Specialty Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Uzmanlık Alanı</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎨</span>
                  <span className="text-white">{artist.specialty}</span>
                </div>
                <p className="text-sm text-gray-300">
                  {artist.specialty} tarzında uzman sanatçı
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  Detaylar için randevu oluşturun veya mesaj gönderin.
                </p>
                {!session && (
                  <p className="text-sm text-purple-300">
                    İletişim için giriş yapmanız gerekiyor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
