"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteArtistButtonProps {
  artistId: string;
  artistName: string;
}

export default function DeleteArtistButton({ artistId, artistName }: DeleteArtistButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md text-sm transition-colors"
    >
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}
