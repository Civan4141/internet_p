import { prisma } from "@/lib/prisma";

interface SiteSettings {
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

// Cache için basit in-memory store
let settingsCache: SiteSettings | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  
  // Cache kontrol et
  if (settingsCache && (now - lastFetch) < CACHE_DURATION) {
    console.log("getSiteSettings - Using cached settings:", settingsCache);
    return settingsCache;
  }

  console.log("getSiteSettings - Fetching fresh settings from database");

  try {
    // @ts-ignore
    const settings = await prisma.setting.findMany();
    console.log("getSiteSettings - Raw settings from DB:", settings);
    
    // Settings'i key-value formatına çevir
    const settingsObject = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    console.log("getSiteSettings - Processed settings object:", settingsObject);

    // Varsayılan değerlerle birleştir
    const defaultSettings: SiteSettings = {
      siteName: settingsObject.siteName || "TattooApp",
      siteDescription: settingsObject.siteDescription || "Dövme sanatçıları ile buluşmanın en kolay yolu",
      contactEmail: settingsObject.contactEmail || "info@tattooapp.com",
      maxDailyAppointments: parseInt(settingsObject.maxDailyAppointments) || 10,
      workingHoursStart: settingsObject.workingHoursStart || "09:00",
      workingHoursEnd: settingsObject.workingHoursEnd || "18:00",
      closedDays: settingsObject.closedDays ? settingsObject.closedDays.split(",") : ["Pazar"],
      maintenanceMode: settingsObject.maintenanceMode === "true",
      allowRegistration: settingsObject.allowRegistration !== "false", // varsayılan true
      emailNotifications: settingsObject.emailNotifications !== "false", // varsayılan true
    };

    console.log("getSiteSettings - Final settings to return:", defaultSettings);

    // Cache'e kaydet
    settingsCache = defaultSettings;
    lastFetch = now;

    return defaultSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    
    // Hata durumunda varsayılan değerleri döndür
    const fallbackSettings = {
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
    };
    
    console.log("getSiteSettings - Using fallback settings due to error:", fallbackSettings);
    return fallbackSettings;
  }
}

// Cache'i temizle (ayarlar güncellendiğinde çağrılabilir)
export function clearSettingsCache() {
  settingsCache = null;
  lastFetch = 0;
}
