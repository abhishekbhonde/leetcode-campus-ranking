const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const colleges = [
  { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi' },
  { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal' },
  { name: 'IIT Roorkee', city: 'Roorkee', state: 'Uttarakhand' },
  { name: 'IIT Guwahati', city: 'Guwahati', state: 'Assam' },
  { name: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { name: 'NIT Warangal', city: 'Warangal', state: 'Telangana' },
  { name: 'NIT Surathkal', city: 'Mangalore', state: 'Karnataka' },
  { name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan' },
  { name: 'BITS Goa', city: 'Goa', state: 'Goa' },
  { name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { name: 'DTU Delhi', city: 'New Delhi', state: 'Delhi' },
  { name: 'NSUT Delhi', city: 'New Delhi', state: 'Delhi' },
  { name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu' },
  { name: 'SRM Chennai', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'COEP Pune', city: 'Pune', state: 'Maharashtra' },
  { name: 'VJTI Mumbai', city: 'Mumbai', state: 'Maharashtra' },
];

async function main() {
  console.log('🌱 Seeding colleges...');
  for (const college of colleges) {
    await prisma.college.upsert({
      where: { name: college.name },
      update: {},
      create: { ...college, country: 'India' },
    });
  }
  console.log(`✅ Seeded ${colleges.length} colleges`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
