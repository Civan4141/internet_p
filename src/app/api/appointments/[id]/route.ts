import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { action, notes } = await request.json();

    // Randevuyu bul
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Yetki kontrolü
    const isOwner = appointment.userId === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Güncelleme verisi
    let updateData: any = {};

    switch (action) {
      case "cancel":
        updateData.status = "cancelled";
        break;
      case "confirm":
        if (!isAdmin) {
          return NextResponse.json({ error: "Only admin can confirm" }, { status: 403 });
        }
        updateData.status = "confirmed";
        break;
      case "complete":
        if (!isAdmin) {
          return NextResponse.json({ error: "Only admin can complete" }, { status: 403 });
        }
        updateData.status = "completed";
        break;
      case "add_note":
        if (!isAdmin) {
          return NextResponse.json({ error: "Only admin can add notes" }, { status: 403 });
        }
        updateData.notes = notes;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Randevuyu güncelle
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
