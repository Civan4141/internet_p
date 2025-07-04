"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminAppointmentActionsProps {
  appointmentId: string;
  status: string;
  notes?: string | null;
}

export default function AdminAppointmentActions({ appointmentId, status, notes }: AdminAppointmentActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");
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
      case "complete":
        confirmMessage = "Randevuyu tamamlandı olarak işaretlemek istediğinizden emin misiniz?";
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

  const handleAddNote = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: "add_note", 
          notes: noteText 
        }),
      });

      if (response.ok) {
        setShowNoteForm(false);
        router.refresh();
      } else {
        alert("Not eklenemedi.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Not eklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white mb-2">Admin İşlemleri</h4>
      
      {/* Status Actions */}
      <div className="space-y-2">
        {status === "pending" && (
          <>
            <button
              onClick={() => handleAction("confirm")}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? "İşleniyor..." : "Onayla"}
            </button>
            <button
              onClick={() => handleAction("cancel")}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? "İşleniyor..." : "İptal Et"}
            </button>
          </>
        )}
        
        {status === "confirmed" && (
          <button
            onClick={() => handleAction("complete")}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? "İşleniyor..." : "Tamamlandı Olarak İşaretle"}
          </button>
        )}
      </div>

      {/* Note Section */}
      <div>
        <button
          onClick={() => setShowNoteForm(!showNoteForm)}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {showNoteForm ? "Not Formunu Kapat" : "Not Ekle/Düzenle"}
        </button>
        
        {showNoteForm && (
          <div className="mt-3 space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Randevu notu..."
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleAddNote}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? "Kaydediliyor..." : "Notu Kaydet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
