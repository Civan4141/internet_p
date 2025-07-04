"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`${userName} adlı kullanıcıyı silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Kullanıcı silinemedi.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Kullanıcı silinemedi.");
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
