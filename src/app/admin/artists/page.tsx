import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteArtistButton from "./DeleteArtistButton";

export default async function AdminArtists() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const artists = await prisma.tattooArtist.findMany({
    include: {
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
              <Link href="/admin" className="text-white hover:text-purple-300 mr-4">
                ← Admin Panel
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Sanatçılar</span>
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
            <h1 className="text-4xl font-bold text-white mb-2">Sanatçılar</h1>
            <p className="text-gray-300">
              Toplam {artists.length} sanatçı kayıtlı
            </p>
          </div>
          <Link
            href="/admin/artists/add"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Yeni Sanatçı Ekle
          </Link>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {artist.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">{artist.name}</h3>
                  <p className="text-gray-300">{artist.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-300">
                  <span className="font-medium text-white">Deneyim:</span> {artist.experience} yıl
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Konum:</span> {artist.location}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Saatlik Ücret:</span> ₺{artist.hourlyRate}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-white">Randevu Sayısı:</span> {artist._count.appointments}
                </p>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm text-center transition-colors"
                >
                  Detay
                </Link>
                <Link
                  href={`/admin/artists/${artist.id}/edit`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm text-center transition-colors"
                >
                  Düzenle
                </Link>
                <DeleteArtistButton 
                  artistId={artist.id} 
                  artistName={artist.name} 
                />
              </div>
            </div>
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Henüz sanatçı yok</h3>
            <p className="text-gray-300 mb-6">
              İlk sanatçıyı ekleyerek başlayın.
            </p>
            <Link
              href="/admin/artists/add"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Sanatçı Ekle
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
