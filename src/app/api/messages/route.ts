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

    const { toId, content } = await request.json();

    // Girdi doğrulama
    if (!toId || !content) {
      return NextResponse.json(
        { error: "Alıcı ve mesaj içeriği gereklidir" },
        { status: 400 }
      );
    }

    // Alıcı kullanıcı var mı kontrol et
    const receiver = await prisma.user.findUnique({
      where: { id: toId },
      select: { id: true, name: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Alıcı kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Mesaj oluştur
    const message = await prisma.message.create({
      data: {
        fromId: session.user.id,
        toId,
        content,
      },
      include: {
        fromUser: {
          select: {
            name: true,
            email: true,
          },
        },
        toUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: "Mesaj başarıyla gönderildi",
        data: message 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let messages;

    if (userId) {
      // Belirli bir kullanıcı ile mesajlaşma
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { fromId: session.user.id, toId: userId },
            { fromId: userId, toId: session.user.id },
          ],
        },
        include: {
          fromUser: {
            select: {
              name: true,
              email: true,
            },
          },
          toUser: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      
      // Okunmamış mesajları okundu olarak işaretle
      await prisma.message.updateMany({
        where: {
          fromId: userId,
          toId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    } else {
      // Tüm konuşmalar (son mesajlarla)
      const conversations = await prisma.message.findMany({
        where: {
          OR: [
            { fromId: session.user.id },
            { toId: session.user.id },
          ],
        },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Konuşmaları grupla (her kullanıcı için son mesaj)
      const groupedConversations = new Map();
      
      conversations.forEach((message) => {
        const otherUserId = message.fromId === session.user.id 
          ? message.toId 
          : message.fromId;
        
        if (!groupedConversations.has(otherUserId)) {
          groupedConversations.set(otherUserId, {
            ...message,
            otherUser: message.fromId === session.user.id 
              ? message.toUser 
              : message.fromUser,
          });
        }
      });

      messages = Array.from(groupedConversations.values());
    }

    return NextResponse.json({ messages });

  } catch (error) {
    console.error("Mesajları getirme hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
