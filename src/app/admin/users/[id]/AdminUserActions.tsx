"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUserActionsProps {
  userId: string;
  userName: string;
  userRole: string;
  currentUserId: string;
}

export default function AdminUserActions({ userId, userName, userRole, currentUserId }: AdminUserActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: "change_role", 
          role: newRole 
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Rol değiştirilemedi.");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      alert("Rol değiştirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (userId === currentUserId) {
      alert("Kendi hesabınızı silemezsiniz.");
      return;
    }

    if (!confirm(`${userName} adlı kullanıcıyı silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/users");
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
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium text-white mb-2">Rol Değiştir</h4>
        <div className="space-y-2">
          {["user", "artist", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              disabled={loading || userRole === role}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                userRole === role
                  ? "bg-purple-600 text-white cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {role === "user" ? "Kullanıcı" : role === "artist" ? "Sanatçı" : "Admin"}
              {userRole === role && " (Mevcut)"}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-white mb-2">İşlemler</h4>
        <div className="space-y-2">
          <a
            href={`/messages/new?toId=${userId}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-center"
          >
            Mesaj Gönder
          </a>
          
          {userId !== currentUserId && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? "Siliniyor..." : "Hesabı Sil"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
