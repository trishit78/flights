// prisma/seed.ts

import { prisma } from "./client";


async function main() {
  // Optional: Delete existing data for a clean re-seed (ensure idempotency)
  await prisma.user.deleteMany(); 
  console.log("Deleted existing user records");

  // Create new data
  
  const kolkata = await prisma.cities.create({
    data:{
        city:"Kolkata"
    }
  });

  const mumbai  = await prisma.cities.create({
    data:{
        city:"Mumbai"
    }
  });

  const delhi = await prisma.cities.create({
    data:{
        city:"Delhi"
    }
  })

  console.log(`Cities added,${mumbai},${delhi}, ${kolkata}` )
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
