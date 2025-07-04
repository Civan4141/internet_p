import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Girdi doğrulama
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar gereklidir" },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçersiz email formatı" },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Kullanıcı zaten var mı kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi ile zaten bir hesap mevcut" },
        { status: 400 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: "",
            avatarUrl: "",
            phone: "",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "Hesap başarıyla oluşturuldu",
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
