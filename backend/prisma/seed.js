const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const colleges = [
  { name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', leetcodeSlug: 'iit-bombay' },
  { name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', leetcodeSlug: 'iit-delhi' },
  { name: 'IIT Madras', city: 'Chennai', state: 'Tamil Nadu', leetcodeSlug: 'iit-madras' },
  { name: 'IIT Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', leetcodeSlug: 'iit-kanpur' },
  { name: 'IIT Kharagpur', city: 'Kharagpur', state: 'West Bengal', leetcodeSlug: 'iit-kharagpur' },
  { name: 'IIT Roorkee', city: 'Roorkee', state: 'Uttarakhand', leetcodeSlug: 'iit-roorkee' },
  { name: 'IIT Guwahati', city: 'Guwahati', state: 'Assam', leetcodeSlug: 'iit-guwahati' },
  { name: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana', leetcodeSlug: 'iit-hyderabad' },
  { name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', leetcodeSlug: 'nit-trichy' },
  { name: 'NIT Warangal', city: 'Warangal', state: 'Telangana', leetcodeSlug: 'nit-warangal' },
  { name: 'NIT Surathkal', city: 'Mangalore', state: 'Karnataka', leetcodeSlug: 'nit-surathkal' },
  { name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', leetcodeSlug: 'bits-pilani' },
  { name: 'BITS Goa', city: 'Goa', state: 'Goa', leetcodeSlug: 'bits-goa' },
  { name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', leetcodeSlug: 'iiit-hyderabad' },
  { name: 'DTU Delhi', city: 'New Delhi', state: 'Delhi', leetcodeSlug: 'dtu-delhi' },
  { name: 'NSUT Delhi', city: 'New Delhi', state: 'Delhi', leetcodeSlug: 'nsut-delhi' },
  { name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', leetcodeSlug: 'vit-vellore' },
  { name: 'SRM Chennai', city: 'Chennai', state: 'Tamil Nadu', leetcodeSlug: 'srm-chennai' },
  { name: 'COEP Pune', city: 'Pune', state: 'Maharashtra', leetcodeSlug: 'coep-pune' },
  { name: 'VJTI Mumbai', city: 'Mumbai', state: 'Maharashtra', leetcodeSlug: 'vjti-mumbai' },
  { name: "JSPM's Rajarshi Shahu College Of Engineering, Pune", city: 'Pune', state: 'Maharashtra', leetcodeSlug: 'jspms-rajarshi-shahu-college-of-engineering-pune' },
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
