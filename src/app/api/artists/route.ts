import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const artists = await prisma.tattooArtist.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        specialty: true,
        imageUrl: true,
        rating: true,
        experience: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Sanatçıları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
