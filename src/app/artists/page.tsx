import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ArtistsPage() {
  const session = await getServerSession(authOptions);

  const artists = await prisma.tattooArtist.findMany({
    include: {
      appointments: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Profesyonel Dövme Sanatçıları
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deneyimli ve yetenekli sanatçılarımızla tanışın. Her tarzda uzman sanatçılarımız sizin için hazır.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{artist.name}</h3>
                  <p className="text-purple-300">{artist.specialty}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white text-sm">{artist.rating}</span>
                    <span className="text-gray-300 text-sm">
                      ({artist.experience} yıl deneyim)
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{artist.bio}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {artist._count.appointments} randevu tamamlandı
                </span>
                <div className="flex space-x-2">
                  <Link
                    href={`/artists/${artist.id}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Profil
                  </Link>
                  {session && (
                    <Link
                      href={`/appointments/create?artistId=${artist.id}`}
                      className="bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      Randevu
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              Henüz sanatçı kaydedilmemiş. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
