"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Artist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
}

export default function NewMessagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUsers();
      fetchArtists();
      
      // URL'den toId parametresini al
      const urlParams = new URLSearchParams(window.location.search);
      const toId = urlParams.get("toId");
      if (toId) {
        // toId'nin artist ID'si olup olmadığını kontrol et
        checkAndSetRecipient(toId);
      }
    }
  }, [session]);

  const checkAndSetRecipient = async (toId: string) => {
    try {
      // Önce toId'nin artist ID'si olup olmadığını kontrol et
      const artistResponse = await fetch(`/api/artist-user?artistId=${toId}`);
      
      if (artistResponse.ok) {
        // Artist ID'si ise user ID'sine çevir
        const artistData = await artistResponse.json();
        setSelectedUser(artistData.user.id);
      } else {
        // Artist ID'si değilse doğrudan user ID'si olarak kullan
        setSelectedUser(toId);
      }
    } catch (error) {
      console.error("Error checking recipient:", error);
      // Hata durumunda doğrudan user ID'si olarak kullan
      setSelectedUser(toId);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      const data = await response.json();
      setArtists(data.artists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toId: selectedUser,
          content: message,
        }),
      });

      if (response.ok) {
        router.push(`/messages/${selectedUser}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
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
              <Link href="/messages" className="text-white hover:text-purple-300 mr-4">
                ← Mesajlar
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                TattooApp
              </Link>
              <span className="ml-4 text-purple-300">/ Yeni Mesaj</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Hoş geldin, {session.user.name}</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Yeni Mesaj</h1>
          <p className="text-xl text-gray-300">
            Sanatçılar veya diğer kullanıcılarla iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Alıcı Seç
            </h3>
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Sanatçı veya kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Artists */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-white mb-3">Sanatçılar</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredArtists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setSelectedUser(artist.id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === artist.id
                        ? "bg-purple-600/50 border-purple-500"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {artist.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-white font-medium">{artist.name}</p>
                      <p className="text-gray-300 text-sm">{artist.specialty}</p>
                    </div>
                    <div className="text-yellow-400 text-sm">
                      ⭐ {artist.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Kullanıcılar</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === user.id
                        ? "bg-purple-600/50 border-purple-500"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Mesajınız
            </h3>
            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mesaj İçeriği
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={8}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={!selectedUser || !message.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
                >
                  Mesaj Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
