"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  description: string;
  createdAt: string;
  artist: {
    name: string;
    specialty: string;
    imageUrl: string;
  };
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Randevuları getirme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "confirmed":
        return "Onaylandı";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
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
                href="/appointments/create"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Yeni Randevu
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
          <h1 className="text-3xl font-bold text-white">Randevularım</h1>
          <Link
            href="/appointments/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Yeni Randevu Oluştur
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Henüz randevunuz yok
            </h2>
            <p className="text-gray-300 mb-8">
              Profesyonel sanatçılarımızla randevu oluşturun ve hayalinizdeki dövmeyi gerçekleştirin.
            </p>
            <Link
              href="/appointments/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İlk Randevunuzu Oluşturun
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={appointment.artist.imageUrl}
                      alt={appointment.artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {appointment.artist.name}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {appointment.artist.specialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tarih:</span>
                    <span className="text-white">
                      {new Date(appointment.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Saat:</span>
                    <span className="text-white">{appointment.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Durum:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>

                {appointment.description && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium">Açıklama:</span> {appointment.description}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(appointment.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturuldu
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="text-purple-300 hover:text-purple-200 text-sm"
                    >
                      Detay
                    </Link>
                    {appointment.status === "pending" && (
                      <button className="text-red-300 hover:text-red-200 text-sm">
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
