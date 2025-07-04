import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clearSettingsCache } from "@/lib/settings";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ayarları getir, yoksa varsayılan değerleri döndür
    // @ts-ignore
    const settings = await prisma.setting.findMany();
    console.log("GET - Fetched settings from DB:", settings);
    
    // Settings'i key-value formatına çevir
    const settingsObject = settings.reduce((acc: Record<string, string>, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Varsayılan değerlerle birleştir
    const defaultSettings = {
      siteName: "TattooApp",
      siteDescription: "Dövme sanatçıları ile buluşmanın en kolay yolu",
      contactEmail: "info@tattooapp.com",
      maxDailyAppointments: "10",
      workingHoursStart: "09:00",
      workingHoursEnd: "18:00",
      closedDays: "Pazar",
      maintenanceMode: "false",
      allowRegistration: "true",
      emailNotifications: "true",
    };

    const finalSettings = { ...defaultSettings, ...settingsObject };
    console.log("GET - Final settings to return:", finalSettings);

    return NextResponse.json({
      settings: finalSettings
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log("Saving settings data:", data);

    // Her ayarı veritabanına kaydet
    for (const [key, value] of Object.entries(data)) {
      console.log(`Saving setting: ${key} = ${value}`);
      // @ts-ignore
      const result = await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      console.log("Upsert result:", result);
    }

    // Kaydedilen ayarları doğrula
    // @ts-ignore
    const savedSettings = await prisma.setting.findMany();
    console.log("All settings after save:", savedSettings);

    // Cache'i temizle ki yeni ayarlar hemen yansısın
    clearSettingsCache();

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
