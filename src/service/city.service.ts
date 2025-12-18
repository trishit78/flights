import { cityDTO } from "../DTO/city.DTO";
import { createCityRepo, deleteCityRepo, getCitiesRepo, getCityRepo, updateCityRepo } from "../repository/city.repository";


export const createCityService = async(cityNameData:string) =>{
    
    const city = await createCityRepo(cityNameData);
    return city;
}


export const getCitiesService = async()=>{
    const cities = await getCitiesRepo();
    
    return cities;
}


export const getCityService = async(id:number)=>{
    const city = await getCityRepo(id)
    return city;
}


export const updateCityService = async(cityData:cityDTO)=>{
   const updatedCity = await updateCityRepo(cityData)
    return updatedCity
}

export const deleteCityService = async(id:number)=>{
    await deleteCityRepo(id)
    return null;
}