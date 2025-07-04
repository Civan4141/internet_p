import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminMessages() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const messages = await prisma.message.findMany({
    include: {
      fromUser: {
        select: {
          name: true,
          email: true,
        },
      },
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
    take: 100, // Son 100 mesaj
  });

  // Konuşmaları grupla
  const conversations = messages.reduce((acc, message) => {
    const key = [message.fromId, message.toId].sort().join('-');
    if (!acc[key]) {
      acc[key] = {
        participants: [message.fromUser, message.toUser],
        messages: [],
        lastMessage: message,
      };
    }
    acc[key].messages.push(message);
    if (message.createdAt > acc[key].lastMessage.createdAt) {
      acc[key].lastMessage = message;
    }
    return acc;
  }, {} as Record<string, any>);

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
              <span className="ml-4 text-purple-300">/ Mesajlar</span>
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
            <h1 className="text-4xl font-bold text-white mb-2">Mesajlar</h1>
            <p className="text-gray-300">
              Toplam {messages.length} mesaj, {Object.keys(conversations).length} konuşma
            </p>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversations */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">
                Konuşmalar
              </h3>
              <p className="text-gray-300 mt-1">
                Kullanıcılar arasındaki konuşmalar
              </p>
            </div>
            <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
              {Object.entries(conversations).map(([key, conversation]) => (
                <div key={key} className="px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {conversation.participants[0].name} ↔ {conversation.participants[1].name}
                      </p>
                      <p className="text-gray-300 text-sm truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-purple-300 text-xs">
                        {conversation.messages.length} mesaj
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">
                Son Mesajlar
              </h3>
              <p className="text-gray-300 mt-1">
                En son gönderilen mesajlar
              </p>
            </div>
            <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
              {messages.slice(0, 10).map((message) => (
                <div key={message.id} className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {message.fromUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium text-sm">
                          {message.fromUser.name} → {message.toUser.name}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.isRead 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {message.isRead ? 'Okundu' : 'Okunmadı'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        {message.content}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(message.createdAt).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Toplam Mesaj</h3>
            <p className="text-3xl font-bold text-blue-400">{messages.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Aktif Konuşma</h3>
            <p className="text-3xl font-bold text-green-400">{Object.keys(conversations).length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Okunmamış Mesaj</h3>
            <p className="text-3xl font-bold text-orange-400">
              {messages.filter(m => !m.isRead).length}
            </p>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Henüz mesaj yok</h3>
            <p className="text-gray-300">
              Kullanıcılar arasındaki mesajlar buraya gelecek.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
