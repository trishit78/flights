'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, ArrowRightLeft, User, ChevronDown, Circle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    router.push(`/flights?${query}`);
  };

  
  return (
    <div className="h-[calc(100vh-4rem)] bg-white flex flex-col items-center font-sans overflow-hidden">
      
      {/* Hero Section - Exact Layout Match */}
      <div className="w-full flex justify-center pt-[64px] pb-[10px] items-end relative">
         <div className="flex flex-col items-center justify-end relative w-[1200px]">
            {/* Image Container */}
            <div 
                role="presentation"
                className="w-full h-[320px] md:h-[320px] bg-contain bg-center bg-no-repeat mb-2"
                style={{
                    backgroundImage: `url(https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg)`
                }}
            />
            {/* Flights Title Div */}
            <div className="absolute bottom-[0px] left-1/2 transform -translate-x-1/2 text-[56px] leading-[64px] font-normal text-black text-center">
                Flights
            </div>
         </div>
      </div>

      {/* Search Box Container */}
      <div className="w-full max-w-[1024px] px-4 md:px-6 relative z-20 mt-8 mb-16">
        <div className="bg-white text-gray-900 rounded-[8px] shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] p-[6px] pb-12 relative">
            
            {/* Top Controls Row */}
            <div className="flex items-center gap-2 mb-4 px-1 py-2 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-900">
                    <ArrowRight name="arrow-right" className="w-4 h-4" />
                    <span>One way</span>
                    <ChevronDown className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-900">
                    <User className="w-4 h-4" />
                    <span>1</span>
                    <ChevronDown className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-900">
                    <span>Economy</span>
                    <ChevronDown className="w-3 h-3" />
                </div>
            </div>

            {/* Inputs Container */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative">
                
                {/* Origin */}
                <div className="flex-1 relative flex items-center border border-gray-300 rounded-[4px] hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white transition-colors h-14">
                    <div className="absolute left-4 z-10">
                        <Circle className="w-4 h-4 text-gray-500" />
                    </div>
                    <Input 
                        className="pl-12 h-full border-none rounded-[4px] focus-visible:ring-0 text-base bg-transparent truncate text-gray-900 placeholder:text-gray-500"
                        placeholder="Where from?"
                        value={searchParams.from}
                        onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                    />
                </div>

                {/* Swap Button (Absolute positioned between inputs) */}
                <div className="absolute left-[33%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                     <div className="bg-white border border-gray-300 rounded-full p-2 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all shadow-[0_1px_2px_0_rgba(60,64,67,0.3)]">
                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                     </div>
                </div>

                {/* Destination */}
                <div className="flex-1 relative flex items-center border border-gray-300 rounded-[4px] hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white transition-colors h-14">
                    <div className="absolute left-4 z-10">
                        <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <Input 
                        className="pl-12 h-full border-none rounded-[4px] focus-visible:ring-0 text-base bg-transparent truncate text-gray-900 placeholder:text-gray-500"
                        placeholder="Where to?"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                    />
                </div>

                {/* Date Group - Single Box for Departure */}
                <div className="flex-1 relative flex items-center border border-gray-300 rounded-[4px] hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white transition-colors h-14">
                    <div className="absolute left-4 z-10">
                        <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <Input 
                        type="text"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = 'text'}
                        className="pl-12 h-full border-none rounded-[4px] focus-visible:ring-0 text-base bg-transparent text-gray-900 placeholder:text-gray-500"
                        placeholder="Departure"
                        value={searchParams.date}
                        onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                    />
                </div>

            </form>

            {/* Floating Explore Button */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[26px]">
                <Button 
                    onClick={handleSearch}
                    className="rounded-full px-8 py-6 h-auto text-base shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                >
                    <Search className="w-5 h-5 mr-3" />
                    Explore
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
