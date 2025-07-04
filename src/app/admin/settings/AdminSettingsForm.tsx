"use client";

import { useState, useEffect } from "react";

interface SettingsFormData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maxDailyAppointments: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  closedDays: string[];
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
}

export default function AdminSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<SettingsFormData>({
    siteName: "TattooApp",
    siteDescription: "Dövme sanatçıları ile buluşmanın en kolay yolu",
    contactEmail: "info@tattooapp.com",
    maxDailyAppointments: 10,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
    closedDays: ["Pazar"],
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
  });

  // Ayarları yükle
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          const settings = data.settings;
          
          setFormData({
            siteName: settings.siteName || "TattooApp",
            siteDescription: settings.siteDescription || "Dövme sanatçıları ile buluşmanın en kolay yolu",
            contactEmail: settings.contactEmail || "info@tattooapp.com",
            maxDailyAppointments: parseInt(settings.maxDailyAppointments) || 10,
            workingHoursStart: settings.workingHoursStart || "09:00",
            workingHoursEnd: settings.workingHoursEnd || "18:00",
            closedDays: settings.closedDays ? settings.closedDays.split(",") : ["Pazar"],
            maintenanceMode: settings.maintenanceMode === "true",
            allowRegistration: settings.allowRegistration === "true",
            emailNotifications: settings.emailNotifications === "true",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        contactEmail: formData.contactEmail,
        maxDailyAppointments: formData.maxDailyAppointments.toString(),
        workingHoursStart: formData.workingHoursStart,
        workingHoursEnd: formData.workingHoursEnd,
        closedDays: formData.closedDays.join(","),
        maintenanceMode: formData.maintenanceMode.toString(),
        allowRegistration: formData.allowRegistration.toString(),
        emailNotifications: formData.emailNotifications.toString(),
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Ayarlar başarıyla kaydedildi! Değişiklikler siteye yansıyacak.");
        // Sayfayı yenile ki yeni ayarlar görünsün
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Ayarlar kaydedilirken bir hata oluştu: ${errorData.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Ayarlar kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosedDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      closedDays: prev.closedDays.includes(day)
        ? prev.closedDays.filter(d => d !== day)
        : [...prev.closedDays, day]
    }));
  };

  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Genel Ayarlar
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Açıklaması
              </label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => setFormData({...formData, siteDescription: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                İletişim E-posta
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Toggle Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Bakım Modu</h4>
                  <p className="text-gray-300 text-sm">Site bakım modunu açar/kapatır</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    formData.maintenanceMode 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {formData.maintenanceMode ? "Açık" : "Kapalı"}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Kayıt Kabul Et</h4>
                  <p className="text-gray-300 text-sm">Yeni kullanıcı kayıtlarını açar/kapatır</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, allowRegistration: !formData.allowRegistration})}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    formData.allowRegistration 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {formData.allowRegistration ? "Açık" : "Kapalı"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">E-posta Bildirimleri</h4>
                  <p className="text-gray-300 text-sm">Sistem e-posta bildirimlerini açar/kapatır</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    formData.emailNotifications 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {formData.emailNotifications ? "Açık" : "Kapalı"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Settings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Randevu Ayarları
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maksimum Günlük Randevu
              </label>
              <input
                type="number"
                value={formData.maxDailyAppointments}
                onChange={(e) => setFormData({...formData, maxDailyAppointments: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Çalışma Saatleri Başlangıç
              </label>
              <input
                type="time"
                value={formData.workingHoursStart}
                onChange={(e) => setFormData({...formData, workingHoursStart: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Çalışma Saatleri Bitiş
              </label>
              <input
                type="time"
                value={formData.workingHoursEnd}
                onChange={(e) => setFormData({...formData, workingHoursEnd: e.target.value})}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kapalı Günler
              </label>
              <div className="space-y-2">
                {days.map((day) => (
                  <label key={day} className="flex items-center text-white">
                    <input 
                      type="checkbox" 
                      checked={formData.closedDays.includes(day)}
                      onChange={() => handleClosedDayChange(day)}
                      className="mr-2" 
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Sistem Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">1.0.0</p>
            <p className="text-gray-300">Versiyon</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{new Date().toLocaleDateString('tr-TR')}</p>
            <p className="text-gray-300">Son Güncelleme</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">🟢</p>
            <p className="text-gray-300">Sistem Durumu</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Sistem İşlemleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors"
          >
            Veritabanı Yedekle
          </button>
          <button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-md transition-colors"
          >
            Sistem Logları
          </button>
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md transition-colors"
          >
            Cache Temizle
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
        >
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}
