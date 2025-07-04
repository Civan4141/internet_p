import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { artistId, date, time, description } = await request.json();

    // Girdi doğrulama
    if (!artistId || !date || !time) {
      return NextResponse.json(
        { error: "Sanatçı, tarih ve saat bilgileri gereklidir" },
        { status: 400 }
      );
    }

    // Sanatçı var mı kontrol et
    const artist = await prisma.tattooArtist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Sanatçı bulunamadı" },
        { status: 404 }
      );
    }

    // Tarih geçmiş tarih mi kontrol et
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return NextResponse.json(
        { error: "Geçmiş tarihe randevu oluşturulamaz" },
        { status: 400 }
      );
    }

    // Aynı sanatçı, tarih ve saatte başka randevu var mı kontrol et
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        artistId,
        date: appointmentDate,
        time,
        status: {
          not: "cancelled",
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Bu tarih ve saatte başka bir randevu mevcut" },
        { status: 400 }
      );
    }

    // Randevu oluştur
    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        artistId,
        date: appointmentDate,
        time,
        description: description || "",
        status: "pending",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        artist: {
          select: {
            name: true,
            specialty: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: "Randevu başarıyla oluşturuldu",
        appointment 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Randevu oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        artist: {
          select: {
            name: true,
            specialty: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ appointments });

  } catch (error) {
    console.error("Randevuları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
