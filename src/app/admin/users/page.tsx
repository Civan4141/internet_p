import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteUserButton from "./DeleteUserButton";

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      appointments: true,
      _count: {
        select: {
          appointments: true,
          messagesSent: true,
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
              <span className="ml-4 text-purple-300">/ Kullanıcılar</span>
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
            <h1 className="text-4xl font-bold text-white mb-2">Kullanıcılar</h1>
            <p className="text-gray-300">
              Toplam {users.length} kullanıcı kayıtlı
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">
              Kullanıcı Listesi
            </h3>
            <p className="text-gray-300 mt-1">
              Tüm kayıtlı kullanıcıları buradan yönetebilirsiniz.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {users.map((user) => (
              <div key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-white">
                          {user.name}
                        </p>
                        <span
                          className={`ml-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "Kullanıcı"}
                        </span>
                      </div>
                      <p className="text-gray-300">{user.email}</p>
                      <p className="text-sm text-gray-400">
                        Kayıt: {user.createdAt.toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {user._count.appointments} randevu
                      </p>
                      <p className="text-gray-300 text-sm">
                        {user._count.messagesSent} mesaj
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Detay
                      </Link>
                      {user.role !== "admin" && user.id !== session.user.id && (
                        <DeleteUserButton 
                          userId={user.id} 
                          userName={user.name} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
