"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelAppointmentButtonProps {
  appointmentId: string;
  status: string;
}

export default function CancelAppointmentButton({ appointmentId, status }: CancelAppointmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Randevuyu iptal etmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Randevu iptal edilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Randevu iptal edilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "pending") {
    return null;
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
    >
      {loading ? "İptal ediliyor..." : "Randevuyu İptal Et"}
    </button>
  );
}
