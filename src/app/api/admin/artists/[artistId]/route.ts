import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { artistId } = await params;
    const { action, ...data } = await request.json();

    switch (action) {
      case "update":
        const artist = await prisma.tattooArtist.update({
          where: { id: artistId },
          data: {
            name: data.name,
            bio: data.bio,
            specialty: data.specialty,
            imageUrl: data.imageUrl,
            experience: parseInt(data.experience),
            rating: parseFloat(data.rating),
          },
        });
        return NextResponse.json({ artist });
        
      case "toggle_active":
        const updatedArtist = await prisma.tattooArtist.update({
          where: { id: artistId },
          data: { isActive: data.isActive },
        });
        return NextResponse.json({ artist: updatedArtist });
        
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating artist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { artistId } = await params;

    await prisma.tattooArtist.delete({
      where: { id: artistId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
