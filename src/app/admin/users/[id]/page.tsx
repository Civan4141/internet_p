import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminUserActions from "./AdminUserActions";

interface UserDetailProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetail({ params }: UserDetailProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      appointments: {
        include: {
          artist: {
            select: {
              name: true,
              specialty: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      messagesSent: {
        include: {
          toUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      messagesReceived: {
        include: {
          fromUser: {
            select: {
              name: true,
              email: true,
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
          messagesSent: true,
          messagesReceived: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Kullanıcı Bulunamadı</h1>
          <Link href="/admin/users" className="text-purple-300 hover:text-purple-200">
            ← Kullanıcılar listesine dön
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
              <Link href="/admin/users" className="text-white hover:text-purple-300 mr-4">
                ← Kullanıcılar
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ {user.name}</span>
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
          {/* User Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-purple-300 text-lg mb-2">{user.email}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      user.role === "admin" 
                        ? "bg-red-500/20 text-red-300" 
                        : "bg-green-500/20 text-green-300"
                    }`}>
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </span>
                    <span className="text-gray-300">
                      Kayıt: {user.createdAt.toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Temel Bilgiler</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Telefon:</span>
                      <span className="text-white">{user.profile?.phone || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Randevu Sayısı:</span>
                      <span className="text-white">{user._count.appointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gönderilen Mesaj:</span>
                      <span className="text-white">{user._count.messagesSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Alınan Mesaj:</span>
                      <span className="text-white">{user._count.messagesReceived}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Hakkında</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {user.profile?.bio || "Henüz bio bilgisi eklenmemiş."}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Randevular ({user.appointments.length})
              </h3>
              {user.appointments.length === 0 ? (
                <p className="text-gray-300 py-8 text-center">
                  Henüz randevu bulunmuyor.
                </p>
              ) : (
                <div className="space-y-4">
                  {user.appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{appointment.artist.name}</h4>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          statusColors[appointment.status as keyof typeof statusColors]
                        }`}>
                          {statusLabels[appointment.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>🎨 {appointment.artist.specialty}</p>
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

            {/* Recent Messages */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Son Mesajlar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Gönderilen</h4>
                  {user.messagesSent.length === 0 ? (
                    <p className="text-gray-300 text-sm">Mesaj bulunmuyor.</p>
                  ) : (
                    <div className="space-y-2">
                      {user.messagesSent.map((message) => (
                        <div key={message.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-white text-sm font-medium">{message.toUser.name}</p>
                          <p className="text-gray-300 text-xs">{message.content.substring(0, 50)}...</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Alınan</h4>
                  {user.messagesReceived.length === 0 ? (
                    <p className="text-gray-300 text-sm">Mesaj bulunmuyor.</p>
                  ) : (
                    <div className="space-y-2">
                      {user.messagesReceived.map((message) => (
                        <div key={message.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-white text-sm font-medium">{message.fromUser.name}</p>
                          <p className="text-gray-300 text-xs">{message.content.substring(0, 50)}...</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(message.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İşlemler</h3>
              <AdminUserActions 
                userId={user.id}
                userName={user.name}
                userRole={user.role}
                currentUserId={session.user.id}
              />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Bekleyen Randevu:</span>
                  <span className="text-yellow-400">
                    {user.appointments.filter(a => a.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Onaylanmış:</span>
                  <span className="text-green-400">
                    {user.appointments.filter(a => a.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tamamlanmış:</span>
                  <span className="text-blue-400">
                    {user.appointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">İptal Edilmiş:</span>
                  <span className="text-red-400">
                    {user.appointments.filter(a => a.status === 'cancelled').length}
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
