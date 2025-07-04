"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  fromId: string;
  toId: string;
  fromUser: {
    name: string;
    email: string;
  };
  toUser: {
    name: string;
    email: string;
  };
  otherUser?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setConversations(data.messages || []);
    } catch (error) {
      console.error("Konuşmaları getirme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
              <span className="text-white">Hoş geldin, {session.user?.name}</span>
              <Link
                href="/profile"
                className="text-white hover:text-purple-300 transition-colors"
              >
                Profil
              </Link>
              <Link
                href="/appointments"
                className="text-white hover:text-purple-300 transition-colors"
              >
                Randevularım
              </Link>
              <Link
                href="/api/auth/signout"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Çıkış Yap
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mesajlar</h1>
            <p className="text-gray-300">
              Sanatçılar ve diğer kullanıcılarla mesajlaşmalarınız
            </p>
          </div>
          <Link
            href="/messages/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Yeni Mesaj
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Henüz mesajınız yok
            </h2>
            <p className="text-gray-300 mb-8">
              Sanatçılarla iletişime geçin ve sorularınızı sorun.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/messages/new"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                İlk Mesajınızı Gönderin
              </Link>
              <Link
                href="/artists"
                className="bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sanatçıları Gör
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.otherUser?.id}`}
                className="block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {conversation.otherUser?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {conversation.otherUser?.name}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {new Date(conversation.createdAt).toLocaleDateString('tr-TR')} {new Date(conversation.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {conversation.otherUser?.email}
                    </p>
                    <p className="text-gray-300 mt-2 truncate">
                      {conversation.fromId === session.user.id ? "Sen: " : ""}
                      {conversation.content}
                    </p>
                  </div>
                  <div className="text-purple-400">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
