import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("DEBUG - Starting settings debug test");
    
    // @ts-ignore
    const allSettings = await prisma.setting.findMany();
    console.log("DEBUG - All settings from database:", allSettings);
    
    // Test setting ekle
    // @ts-ignore
    const testSetting = await prisma.setting.upsert({
      where: { key: "debugTest" },
      update: { value: "test-value-updated" },
      create: { key: "debugTest", value: "test-value-created" },
    });
    console.log("DEBUG - Created/updated test setting:", testSetting);
    
    // Tekrar tüm ayarları getir
    // @ts-ignore
    const allSettingsAfter = await prisma.setting.findMany();
    console.log("DEBUG - All settings after test upsert:", allSettingsAfter);
    
    return NextResponse.json({
      success: true,
      beforeCount: allSettings.length,
      afterCount: allSettingsAfter.length,
      testSetting,
      allSettings: allSettingsAfter
    });
  } catch (error) {
    console.error("DEBUG - Error in settings debug:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
