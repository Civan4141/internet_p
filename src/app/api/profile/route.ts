import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, bio, phone, avatarUrl } = await request.json();

    // Kullanıcı adını güncelle
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    // Profil bilgilerini güncelle
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        phone,
        avatarUrl,
      },
      create: {
        userId: session.user.id,
        bio,
        phone,
        avatarUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
