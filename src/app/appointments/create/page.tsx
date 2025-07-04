"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
}

function CreateAppointmentForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const artistId = searchParams.get("artistId");

  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState(artistId || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await fetch("/api/artists");
      const data = await response.json();
      setArtists(data.artists || []);
    } catch (error) {
      console.error("Sanatçılar yüklenirken hata:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artistId: selectedArtistId,
          date,
          time,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/appointments?success=true");
      } else {
        setError(data.error || "Randevu oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      setError("Randevu oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  // Bugünün tarihini minimum tarih olarak ayarla
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Randevu Oluştur
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artist Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sanatçı Seçin
              </label>
              <select
                value={selectedArtistId}
                onChange={(e) => setSelectedArtistId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Sanatçı seçin...</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name} - {artist.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tarih
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Saat
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Saat seçin...</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Dövme hakkında detayları yazın..."
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Oluşturuluyor..." : "Randevu Oluştur"}
              </button>
              <Link
                href="/artists"
                className="flex-1 bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white py-3 px-6 rounded-md font-semibold text-center transition-colors"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function CreateAppointment() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <CreateAppointmentForm />
    </Suspense>
  );
}
