"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  fromId: string;
  toId: string;
  isRead: boolean;
  fromUser: {
    name: string;
    email: string;
  };
  toUser: {
    name: string;
    email: string;
  };
}

interface ChatPageProps {
  params: Promise<{ userId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [userId, setUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && userId) {
      fetchMessages();
      fetchOtherUser();
    }
  }, [session, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchOtherUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setOtherUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toId: userId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
              {otherUser && (
                <span className="ml-4 text-purple-300">/ {otherUser.name}</span>
              )}
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

      {/* Chat Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {otherUser?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">
                  {otherUser?.name}
                </h3>
                <p className="text-sm text-gray-300">{otherUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Henüz mesaj yok. İlk mesajı gönderin!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.fromId === session.user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.fromId === session.user.id
                        ? "bg-purple-600 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-white/10">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
