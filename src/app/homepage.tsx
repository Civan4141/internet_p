import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">TattooApp</h1>
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Tarzını Yansıtmanın En Kolay Yolu!
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Online dövme randevunu şimdi oluştur. Profesyonel dövme sanatçıları ile tanış, 
            hayalindeki dövmeyi gerçekleştir.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/appointments/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Randevu Oluştur
            </Link>
            <Link
              href="/artists"
              className="bg-transparent border-2 border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Sanatçıları Gör
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Profesyonel Sanatçılar</h3>
            <p className="text-gray-300">
              Deneyimli ve yetenekli dövme sanatçıları ile tanışın. Her tarzda uzman sanatçılar.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Kolay Randevu</h3>
            <p className="text-gray-300">
              Online olarak kolayca randevu oluşturun. Tarih ve saatinizi seçin.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Direkt İletişim</h3>
            <p className="text-gray-300">
              Sanatçılarla direkt mesajlaşın. Fikirlerinizi paylaşın ve detayları konuşun.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
