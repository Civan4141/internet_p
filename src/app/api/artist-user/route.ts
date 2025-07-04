import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get('artistId');
  const artistName = searchParams.get('artistName');

  if (!artistId && !artistName) {
    return NextResponse.json({ error: "Artist ID or name is required" }, { status: 400 });
  }

  try {
    let artist;
    
    if (artistId) {
      artist = await prisma.tattooArtist.findUnique({
        where: { id: artistId },
        select: { name: true }
      });
    } else if (artistName) {
      artist = await prisma.tattooArtist.findFirst({
        where: { name: artistName },
        select: { name: true }
      });
    }

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Sanatçı adına göre user hesabını bul
    const user = await prisma.user.findFirst({
      where: { 
        name: artist.name,
        role: 'artist'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Artist user account not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error finding artist user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
