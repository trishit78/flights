import type { signInDTO, signUpDTO, userDataDTO } from "../DTO/user.DTO.js";
import { ROLE } from "../generated/prisma/enums.js";
import { prisma } from "../prisma/client.js";

export const signUpRepo = async(signUpData:signUpDTO)=>{
   try {
        const user = await prisma.user.create({
        data:signUpData
    })

    const customerRole = await prisma.role.findUnique({
        where: { name: ROLE.CUSTOMER }
      });

      if (!customerRole) {
        throw new Error("Default CUSTOMER role not found");
      }

      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: customerRole.id
        }
      });
    return user;       
    } catch (error) {
        throw new Error('Error occured in sign up repo')
    }

}

export const getUserByEmail = async(signInData:signInDTO)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                email:signInData.email
            }
        })
        return user;
    } catch (error) {
        throw new Error('Error occured in sign in repo')
    }
}

export const getUserById = async(userId:number)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        return user
     } catch (error) {
        throw new Error('Error occured in sign in repo')
    }
}

export const addRoleToUserRepo = async(userData:userDataDTO)=>{
    try {
        console.log('added roles to user repo');
    const user = await getUserById(userData.id);
    console.log('user',user);
    if(!user){
        throw new Error('no user found on this userId');
    }
    const role = await prisma.role.findUnique({
        where:{
            name:userData.role
        }
    });
    console.log('userRole',role)
    if(!role){
        throw new Error('can not find the role');
    }

  const userRole = await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id
    }
  });
console.log('user role',userRole)
  return userRole;
    } catch (error) {
          throw new Error('Error occured in sign up repo')
    }
}