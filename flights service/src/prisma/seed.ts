// prisma/seed.ts
//run cmd: npx prisma db seed

import { prisma } from "./client";


// async function main() {
//   // Optional: Delete existing data for a clean re-seed (ensure idempotency)
//   await prisma.user.deleteMany(); 
//   console.log("Deleted existing user records");

//   // Create new data
  
//   const kolkata = await prisma.cities.create({
//     data:{
//         city:"Kolkata"
//     }
//   });

//   const mumbai  = await prisma.cities.create({
//     data:{
//         city:"Mumbai"
//     }
//   });

//   const delhi = await prisma.cities.create({
//     data:{
//         city:"Delhi"
//     }
//   })

//   console.log(`Cities added,${mumbai},${delhi}, ${kolkata}` )
// }



async function main2() {
  // Optional: Delete existing data for a clean re-seed (ensure idempotency)
  await prisma.seat.deleteMany(); 
  console.log("Deleted existing seats records");

  // Create new data
  const seatsData = [
    {airplaneId: 1,
        row: 1,
        col: 'A',},
        {
          airplaneId: 1,
        row: 1,
        col: 'B',
        },
        {
          airplaneId: 1,
        row: 1,
        col: 'C',
        },
        {
          airplaneId: 1,
        row: 1,
        col: 'D',
        },
        {
          airplaneId: 1,
        row: 1,
        col: 'E',
        },
        {
          airplaneId: 1,
        row: 1,
        col: 'F',
        }
  ]

  const res = await prisma.seat.createMany({
    data:seatsData
  })
  console.log("added data in seats",res);
}


main2()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
