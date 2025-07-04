import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tattooapp.com' },
    update: {},
    create: {
      email: 'admin@tattooapp.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      profile: {
        create: {
          bio: 'TattooApp sistem yöneticisi',
          avatarUrl: '',
          phone: '+90 555 123 45 67',
        },
      },
    },
  });

  // Test kullanıcı oluştur
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@tattooapp.com' },
    update: {},
    create: {
      email: 'user@tattooapp.com',
      name: 'Test Kullanıcı',
      password: userPassword,
      role: 'user',
      profile: {
        create: {
          bio: 'Dövme meraklısı',
          avatarUrl: '',
          phone: '+90 555 987 65 43',
        },
      },
    },
  });

  // Dövme sanatçıları oluştur
  const artists = [
    {
      name: 'Mehmet Demir',
      email: 'mehmet.demir@tattooapp.com',
      bio: 'Realistik dövme konusunda uzman, 8 yıllık deneyim.',
      specialty: 'Realistik',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      experience: 8,
      rating: 4.8,
      location: 'İstanbul',
      hourlyRate: 750,
    },
    {
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@tattooapp.com',
      bio: 'Minimalist ve geometrik tasarımlar konusunda uzman.',
      specialty: 'Minimalist',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b35b4ae2?w=400&h=400&fit=crop&crop=face',
      experience: 5,
      rating: 4.9,
      location: 'Ankara',
      hourlyRate: 600,
    },
    {
      name: 'Emre Şen',
      email: 'emre.sen@tattooapp.com',
      bio: 'Tribal ve geleneksel Türk motiflerinde uzman.',
      specialty: 'Tribal',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      experience: 10,
      rating: 4.7,
      location: 'İzmir',
      hourlyRate: 800,
    },
    {
      name: 'Selin Özkan',
      email: 'selin.ozkan@tattooapp.com',
      bio: 'Renkli ve çiçek motifli dövmeler konusunda uzman.',
      specialty: 'Renkli',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      experience: 6,
      rating: 4.6,
      location: 'Bursa',
      hourlyRate: 650,
    },
  ];

  // Sanatçılar için User hesapları ve TattooArtist kayıtları oluştur
  for (const artist of artists) {
    const artistPassword = await bcrypt.hash('artist123', 10);
    
    // Sanatçı için User hesabı oluştur
    const artistUser = await prisma.user.upsert({
      where: { email: artist.email },
      update: {},
      create: {
        email: artist.email,
        name: artist.name,
        password: artistPassword,
        role: 'artist',
        profile: {
          create: {
            bio: artist.bio,
            avatarUrl: artist.imageUrl,
            phone: `+90 555 ${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
          },
        },
      },
    });

    // TattooArtist kaydı oluştur - sadece name ile kontrol edebiliriz
    const existingArtist = await prisma.tattooArtist.findUnique({
      where: { name: artist.name }
    });

    if (!existingArtist) {
      await prisma.tattooArtist.create({
        data: {
          name: artist.name,
          bio: artist.bio,
          specialty: artist.specialty,
          imageUrl: artist.imageUrl,
          experience: artist.experience,
          rating: artist.rating,
          location: artist.location,
          hourlyRate: artist.hourlyRate,
        },
      });
    }
  }

  console.log('✅ Seed data başarıyla oluşturuldu!');
  console.log('Admin kullanıcısı: admin@tattooapp.com / admin123');
  console.log('Test kullanıcısı: user@tattooapp.com / user123');
  console.log('Sanatçı hesapları:');
  console.log('- mehmet.demir@tattooapp.com / artist123');
  console.log('- ayse.kaya@tattooapp.com / artist123');
  console.log('- emre.sen@tattooapp.com / artist123');
  console.log('- selin.ozkan@tattooapp.com / artist123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
