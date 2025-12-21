import { cityDTO } from "../DTO/city.DTO";
import { prisma } from "../prisma/client"

export const createCityRepo = async(cityDataName:string) =>{
       const city = await prisma.cities.create({        
            data:{
                city:cityDataName
            }
       });
       return city;
};

export const getCitiesRepo = async()=>{
    const cities = await prisma.cities.findMany();
    return cities;
}

export const getCityRepo = async(id:number)=>{
    const city = await prisma.cities.findUnique({
        where:{
            id:id
        }
    });
    return city;
}

export const updateCityRepo = async(cityData:cityDTO)=>{
    const updatedCity = await prisma.cities.update({
        where:{
            id:cityData.id
        },
        data:{
            city:cityData.name
        }
    })
    return updatedCity
}

export const deleteCityRepo = async(id:number)=>{
     await prisma.cities.delete({
        where:{
            id:id
        }
    })
}