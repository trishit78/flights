'use client';

import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { 
  ArrowRight, 
  ArrowRightLeft, 
  Calendar, 
  ChevronDown, 
  Circle, 
  Filter, 
  Info, 
  MapPin, 
  User, 
  MoreHorizontal,
  Search
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface Flight {
  id: number;
  flightNumber: string;
  price: number;
  departureAirportId: string;
  arrivalAirportId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  // Mock fields for UI demonstration
  airline?: string;
  duration?: string;
  stops?: string;
  emissions?: string;
  co2e?: string;
}

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search State (mirrors Home Page for consistency)
  const [params, setParams] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || ''
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await api.get('/flightsService/api/v1/flight');
        const allFlights: Flight[] = response.data.data;
        
        const from = params.from.toLowerCase();
        const to = params.to.toLowerCase();
        
        const filtered = allFlights.filter(f => {
           if (from && !f.departureAirportId.toLowerCase().includes(from)) return false;
           if (to && !f.arrivalAirportId.toLowerCase().includes(to)) return false;
           return true;
        }).map(f => ({
            ...f,
            // Add mock data for UI completeness since API is simple
            airline: f.flightNumber.startsWith('6E') ? 'IndiGo' : f.flightNumber.startsWith('SG') ? 'SpiceJet' : 'Air India',
            duration: '2 hr 20 min',
            stops: 'Nonstop',
            emissions: '-6% emissions',
            co2e: '93 kg CO2e'
        }));

        setFlights(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]); // Re-fetch when URL changes

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const query = new URLSearchParams(params).toString();
      router.push(`/flights?${query}`);
  };

  if (loading) return (
      <div className="min-h-screen bg-white pt-8 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
              <span className="mt-2 text-sm text-gray-500">Searching flights...</span>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      {/* --- Search Section (Sticky/Top) --- */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-[1024px] mx-auto px-4 py-4">
            
            {/* Controls */}
            <div className="flex items-center gap-4 mb-3 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-900">
                    <ArrowRight className="w-4 h-4" />
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

            {/* Compact Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                
                {/* Locations Group */}
                <div className="flex-[2] flex relative border border-gray-300 rounded-[4px] shadow-sm overflow-hidden h-12">
                    {/* Origin */}
                    <div className="flex-1 relative flex items-center hover:bg-gray-50 transition-colors">
                        <div className="absolute left-3 z-10">
                            <Circle className="w-3 h-3 text-gray-500" />
                        </div>
                        <Input 
                            className="pl-10 h-full border-none rounded-none focus-visible:ring-0 text-sm bg-transparent truncate font-medium"
                            value={params.from}
                            onChange={(e) => setParams({...params, from: e.target.value})}
                        />
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] bg-gray-300 relative flex items-center justify-center">
                         <div className="absolute bg-white border border-gray-300 rounded-full p-1 cursor-pointer hover:bg-gray-50 z-20 shadow-sm">
                            <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                         </div>
                    </div>

                    {/* Destination */}
                    <div className="flex-1 relative flex items-center hover:bg-gray-50 transition-colors">
                        <div className="absolute left-3 z-10">
                            <MapPin className="w-3 h-3 text-gray-500" />
                        </div>
                        <Input 
                            className="pl-10 h-full border-none rounded-none focus-visible:ring-0 text-sm bg-transparent truncate font-medium"
                            value={params.to}
                            onChange={(e) => setParams({...params, to: e.target.value})}
                        />
                    </div>
                </div>

                {/* Date Input */}
                <div className="flex-1 relative flex items-center border border-gray-300 rounded-[4px] shadow-sm hover:bg-gray-50 transition-colors h-12">
                     <div className="absolute left-3 z-10">
                        <Calendar className="w-3 h-3 text-gray-500" />
                    </div>
                    <Input 
                        type="date"
                        className="pl-10 h-full border-none rounded-[4px] focus-visible:ring-0 text-sm bg-transparent font-medium"
                        value={params.date}
                        onChange={(e) => setParams({...params, date: e.target.value})}
                    />
                </div>

                {/* Search Button */}
                <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0">
                    <Search className="w-5 h-5" />
                </Button>
            </form>

        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        
        {/* Results Header / Tabs */}
        {flights.length > 0 && (
            <>

                 {/* Section Title */}
                 <div className="flex justify-between items-end mb-4">
                     <div>
                         <h2 className="text-xl font-normal text-gray-800">Available flights</h2>
                         <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                             Ranked based on price and convenience <Info className="w-3 h-3" />
                         </p>
                     </div>
                     <div className="text-sm text-blue-600 font-medium cursor-pointer flex items-center">
                         Sorted by top flights <ArrowRight className="w-3 h-3 ml-1 rotate-90" />
                     </div>
                 </div>
            </>
        )}

        {/* --- Flight List --- */}
        <div className="space-y-4">
          {flights.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-gray-500 mb-2">No available flights</div>
                <Button variant="link" className="text-blue-600" onClick={() => router.push('/')}>Go back home</Button>
            </div>
          ) : (
            flights.map((flight) => (
                <div key={flight.id} onClick={() => router.push(`/book/${flight.id}`)} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-center">
                        
                        {/* Left: Airline & Times */}
                        <div className="flex gap-6 items-center">
                             {/* Airline Logo (Mock) */}
                             <div className="w-8 h-8 bg-red-100 rounded-sm flex items-center justify-center text-xs font-bold text-red-600">
                                 {flight.airline?.substring(0,2).toUpperCase() || 'AL'}
                             </div>
                             
                             <div>
                                 <div className="text-base font-bold text-gray-900">
                                     {new Date(flight.departureTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} – {new Date(flight.arrivalTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
                                 </div>
                                 <div className="text-xs text-gray-500 font-medium mt-0.5">{flight.airline || 'Airline'}</div>
                             </div>
                        </div>

                        {/* Middle: Duration & Stops */}
                        <div className="flex flex-col flex-1 px-8 text-left">
                            <div className="text-sm font-medium text-gray-800">{flight.duration}</div>
                            <div className="text-xs text-gray-500">{flight.departureAirportId}-{flight.arrivalAirportId}</div>
                        </div>

                         <div className="flex flex-col flex-1 px-4 text-left border-l border-transparent md:border-gray-100">
                            <div className="text-sm font-medium text-gray-800">{flight.stops}</div>
                        </div>

                         {/* Emissions */}
                         <div className="hidden md:flex flex-col w-32 text-left">
                            <div className="text-sm font-medium text-gray-800">{flight.co2e}</div>
                            <div className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full w-fit mt-0.5">{flight.emissions}</div>
                        </div>

                        {/* Right: Price & Action */}
                         <div className="flex items-center gap-6 min-w-[120px] justify-end">
                             <div className="text-right">
                                 <div className="text-lg font-bold text-[#1a73e8]">₹{flight.price.toLocaleString()}</div>
                                 <div className="text-xs text-gray-500">round trip</div>
                             </div>
                             
                             <Link href={`/book/${flight.id}`}>
                                <Button variant="ghost" size="icon" className="group-hover:bg-blue-50 rounded-full h-8 w-8">
                                    <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                                </Button>
                             </Link>
                         </div>

                    </div>
                </div>
            ))
          )}
        </div>
        
        {/* Helper Text */}
        {flights.length > 0 && (
             <p className="text-xs text-gray-500 mt-6 text-center">
                 Prices include required taxes + fees for 1 adult. Optional charges and <span className="text-blue-600 cursor-pointer">bag fees</span> may apply.
             </p>
        )}

      </div>
    </div>
  );
}
