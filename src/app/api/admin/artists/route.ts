import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { name, email, bio, specialty, imageUrl, experience, location, hourlyRate } = data;

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda" }, { status: 400 });
    }

    // Sanatçı adı kontrolü
    const existingArtist = await prisma.tattooArtist.findUnique({
      where: { name }
    });

    if (existingArtist) {
      return NextResponse.json({ error: "Bu sanatçı adı zaten kullanımda" }, { status: 400 });
    }

    // Default password oluştur
    const defaultPassword = "artist123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Önce User oluştur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "artist"
      }
    });

    // Sonra TattooArtist oluştur
    const artist = await prisma.tattooArtist.create({
      data: {
        name,
        bio,
        specialty,
        imageUrl,
        experience: parseInt(experience),
        location,
        hourlyRate: parseFloat(hourlyRate),
        isActive: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      artist,
      message: `Sanatçı başarıyla eklendi. Giriş bilgileri: ${email} / ${defaultPassword}`
    });
  } catch (error) {
    console.error("Error creating artist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
