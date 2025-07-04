"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AppointmentActionsProps {
  appointmentId: string;
  status: string;
}

export default function AppointmentActions({ appointmentId, status }: AppointmentActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: string) => {
    let confirmMessage = "";
    
    switch (action) {
      case "confirm":
        confirmMessage = "Randevuyu onaylamak istediğinizden emin misiniz?";
        break;
      case "cancel":
        confirmMessage = "Randevuyu iptal etmek istediğinizden emin misiniz?";
        break;
    }
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("İşlem gerçekleştirilemedi.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("İşlem gerçekleştirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {status === 'pending' && (
        <button
          onClick={() => handleAction("confirm")}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          {loading ? "İşleniyor..." : "Onayla"}
        </button>
      )}
      {status !== 'cancelled' && (
        <button
          onClick={() => handleAction("cancel")}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          {loading ? "İşleniyor..." : "İptal"}
        </button>
      )}
    </>
  );
}
