"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Artist {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  imageUrl: string;
  experience: number;
  rating: number;
  isActive: boolean;
}

interface ArtistEditFormProps {
  artist: Artist;
}

export default function ArtistEditForm({ artist }: ArtistEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: artist.name,
    bio: artist.bio,
    specialty: artist.specialty,
    imageUrl: artist.imageUrl,
    experience: artist.experience.toString(),
    rating: artist.rating.toString(),
  });

  const specialties = [
    "Realistik",
    "Minimalist", 
    "Tribal",
    "Renkli",
    "Geleneksel",
    "Watercolor",
    "Geometrik",
    "Blackwork",
    "Japon",
    "Diğer"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/artists/${artist.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          ...formData,
        }),
      });

      if (response.ok) {
        router.push(`/admin/artists/${artist.id}`);
        router.refresh();
      } else {
        alert("Sanatçı güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error updating artist:", error);
      alert("Sanatçı güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Ad Soyad *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-white mb-2">
            Uzmanlık Alanı *
          </label>
          <select
            id="specialty"
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty} className="bg-gray-800">
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-white mb-2">
            Deneyim (Yıl) *
          </label>
          <input
            type="number"
            id="experience"
            min="0"
            max="50"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-white mb-2">
            Değerlendirme (1-5)
          </label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-white mb-2">
          Profil Fotoğrafı URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="https://example.com/photo.jpg"
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img 
              src={formData.imageUrl} 
              alt="Önizleme" 
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
          Hakkında *
        </label>
        <textarea
          id="bio"
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Sanatçı hakkında bilgi..."
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-md transition-colors"
        >
          {loading ? "Güncelleniyor..." : "Güncelle"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/artists/${artist.id}`)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
