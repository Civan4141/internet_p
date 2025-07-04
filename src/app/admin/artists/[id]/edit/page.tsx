import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ArtistEditForm from "./ArtistEditForm";

interface ArtistEditProps {
  params: Promise<{ id: string }>;
}

export default async function AdminArtistEdit({ params }: ArtistEditProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const { id } = await params;

  const artist = await prisma.tattooArtist.findUnique({
    where: { id },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href={`/admin/artists/${artist.id}`} className="text-white hover:text-purple-300 mr-4">
                ← {artist.name}
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Sanatçı Düzenle</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Hoş geldin, {session.user.name}</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Sanatçı Düzenle</h1>
          <ArtistEditForm artist={artist} />
        </div>
      </main>
    </div>
  );
}
