import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ArtistAddForm from "./ArtistAddForm";

export default async function AdminArtistAdd() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

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
              <span className="ml-4 text-purple-300">/ Yeni Sanatçı</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Hoş geldin, {session.user.name}</span>
              <a
                href="/auth/signout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Çıkış Yap
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Yeni Sanatçı Ekle</h1>
          <ArtistAddForm />
        </div>
      </main>
    </div>
  );
}
