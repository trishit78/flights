// prisma/seed.ts
// add seed script in prisma config
//run cmd: npx prisma db seed  inside src   (npm i -D tsx)

import { ROLE } from "../generated/prisma/enums.js";
import { prisma } from "./client.js";


async function main() {
  
  // Create new data
  const admin = await prisma.role.create({
    data:{
        name:ROLE.ADMIN
    }
  })


  const customer = await prisma.role.create({
    data:{
        name:ROLE.CUSTOMER
    }
  })

  const flight_company = await prisma.role.create({
    data:{
        name:ROLE.FLIGHT_COMPANY
    }
  })


  console.log('data',admin,customer,flight_company);
}




main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
