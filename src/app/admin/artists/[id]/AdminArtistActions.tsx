"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminArtistActionsProps {
  artistId: string;
  artistName: string;
  isActive: boolean;
}

export default function AdminArtistActions({ artistId, artistName, isActive }: AdminArtistActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleActive = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/artists/${artistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: "toggle_active", 
          isActive: !isActive 
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("İşlem gerçekleştirilemedi.");
      }
    } catch (error) {
      console.error("Error toggling artist status:", error);
      alert("İşlem gerçekleştirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`${artistName} adlı sanatçıyı silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/artists/${artistId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/artists");
        router.refresh();
      } else {
        alert("Sanatçı silinemedi.");
      }
    } catch (error) {
      console.error("Error deleting artist:", error);
      alert("Sanatçı silinemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleToggleActive}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "İşleniyor..." : (isActive ? "Pasif Yap" : "Aktif Yap")}
      </button>
      
      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
      >
        {loading ? "Siliniyor..." : "Sil"}
      </button>
    </div>
  );
}
