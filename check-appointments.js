const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        date: true,
        time: true,
        status: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        artist: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('📅 Randevular:');
    appointments.forEach(appointment => {
      console.log(`ID: ${appointment.id}`);
      console.log(`Tarih: ${appointment.date}`);
      console.log(`Saat: ${appointment.time}`);
      console.log(`Durum: ${appointment.status}`);
      console.log(`Kullanıcı: ${appointment.user.name} (${appointment.user.email})`);
      console.log(`Sanatçı: ${appointment.artist.name}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkAppointments();
