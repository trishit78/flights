'use client';

import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Luggage, 
  Leaf, 
  Info, 
  Briefcase,
  Usb,
  Monitor,
  ChevronDown,
  Plus,
  Minus
} from "lucide-react";

interface Flight {
  id: number;
  flightNumber: string;
  price: number;
  departureAirportId: string;
  arrivalAirportId: string;
  totalSeats: number;
  departureTime: string;
  arrivalTime: string;
}

// Mock mapping for demo purposes
const CITY_NAMES: {[key: string]: string} = {
  'DEL': 'New Delhi',
  'CCU': 'Kolkata',
  'BOM': 'Mumbai',
  'BLR': 'Bengaluru',
  'MAA': 'Chennai'
};

export default function BookingPage() {
  const { flightId } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [passengerMenuOpen, setPassengerMenuOpen] = useState(false);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const fetchFlight = async () => {
      try {
        const response = await api.get(`/flightsService/api/v1/flight/${flightId}`);
        setFlight(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };

    if (flightId) fetchFlight();
  }, [flightId, router]);

  const handleBook = async () => {
    setBookingLoading(true);
    try {
      const response = await api.post('/bookingService/api/v1/booking', {
        flightId: Number(flightId),
        noOfSeats: Number(seats)
      });

      const bookingData = response.data.data;
      router.push(`/book/${flightId}/payment?bookingId=${bookingData.id}&amount=${bookingData.totalCost}`);

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.response?.data?.message || 'Booking failed');
      setBookingLoading(false);
    }
  };

  // Function to handle seat change safely
  const updateSeats = (delta: number) => {
    setSeats(prev => Math.max(1, Math.min(9, prev + delta))); // Limit 1-9
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading flight details...</div>;
  if (error || !flight) return <div className="p-8 text-center text-red-500">{error || 'Flight not found'}</div>;

  const originCity = CITY_NAMES[flight.departureAirportId] || flight.departureAirportId;
  const destCity = CITY_NAMES[flight.arrivalAirportId] || flight.arrivalAirportId;
  const airlineName = flight.flightNumber.startsWith('6E') ? 'IndiGo' : flight.flightNumber.startsWith('SG') ? 'SpiceJet' : 'Air India';
  
  // Format dates
  const depDate = new Date(flight.departureTime);
  const arrDate = new Date(flight.arrivalTime);
  
  const formattedDate = depDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const depTime = depDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
  const arrTime = arrDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});

  // Calculate duration (Mock or real)
  const durationMs = arrDate.getTime() - depDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationStr = `${hours} hr ${minutes} min`;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1024px] mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-normal text-gray-900 flex items-center gap-3">
                    {originCity} <ArrowRight className="w-6 h-6 text-gray-400" /> {destCity}
                </h1>
                <div className="text-sm text-gray-600 mt-2 flex gap-2 items-center relative">
                    <span>One way</span> • <span>Economy</span> • 
                    
                    {/* Passenger Dropdown Trigger */}
                    <div className="relative">
                        <button 
                            onClick={() => setPassengerMenuOpen(!passengerMenuOpen)}
                            className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded text-blue-600 font-medium"
                        >
                            {seats} passenger{seats > 1 ? 's' : ''} <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Dropdown Content */}
                        {passengerMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <div className="text-base text-gray-900">Adults</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => updateSeats(-1)}
                                            disabled={seats <= 1}
                                            className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-50 hover:bg-gray-200"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-4 text-center font-medium">{seats}</span>
                                        <button 
                                            onClick={() => updateSeats(1)}
                                            disabled={seats >= (flight?.totalSeats || 9)}
                                            className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                    <Button variant="ghost" size="sm" onClick={() => setPassengerMenuOpen(false)}>Done</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-normal text-gray-900">₹{flight.price * seats}</div>
                <div className="text-xs text-gray-500 mt-1">Lowest total price</div>
            </div>
        </div>

        {/* Selected Flights Header */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-normal text-gray-800">Selected flights</h2>
        </div>

        {/* Main Flight Card */}
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
            
            {/* Card Content Wrapper */}
            <div className="p-6">
                
                {/* Top Row: Airline & Title */}
                <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white text-xs font-bold rounded-sm">
                            {airlineName.substring(0,2).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900">
                            Departing flight • {formattedDate}
                        </div>
                     </div>
                     <Button variant="outline" className="text-blue-600 border-gray-300 hover:bg-blue-50 rounded-full h-8 px-4 text-sm">
                        Change flight
                     </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Timeline Section */}
                    <div className="flex-1 relative pl-4">
                        {/* Vertical Dotted Line */}
                        <div className="absolute left-[21px] top-3 bottom-8 w-0.5 border-l-2 border-dotted border-gray-300 z-0"></div>

                        {/* Departure Node */}
                        <div className="flex gap-6 relative z-10 mb-6">
                            <div className="w-3 h-3 rounded-full border-2 border-gray-600 bg-white mt-1.5 shrink-0"></div>
                            <div>
                                <div className="text-base font-medium text-gray-900">{depTime} • {flight.departureAirportId}</div>
                                <div className="text-sm text-gray-500 mt-0.5">Travel time: {durationStr}</div>
                            </div>
                        </div>

                         {/* Arrival Node */}
                         <div className="flex gap-6 relative z-10">
                            <div className="w-3 h-3 rounded-full border-2 border-gray-600 bg-white mt-1.5 shrink-0"></div>
                            <div>
                                <div className="text-base font-medium text-gray-900">{arrTime} • {flight.arrivalAirportId}</div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
                             <span>{airlineName}</span> • <span>Economy</span> • <span>Boeing 737</span> • <span>{flight.flightNumber}</span>
                        </div>
                        <div className="mt-1 text-xs text-red-600 font-medium">Often delayed by 30+ min</div>

                    </div>

                    {/* Amenities Column */}
                    <div className="w-full md:w-72 space-y-4 text-xs text-gray-600 border-l border-transparent md:border-gray-100 md:pl-8">
                        <div className="flex items-start gap-3">
                            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Below average legroom (29 in)</span>
                        </div>
                        <div className="flex items-start gap-3">
                             <Monitor className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Stream media to your device</span>
                        </div>
                         <div className="flex items-start gap-3">
                            <Usb className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>In-seat USB power</span>
                        </div>
                         <div className="flex items-start gap-3">
                            <Leaf className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Emissions estimate: 102 kg CO2e</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Contrail warming potential: Low</span>
                        </div>
                    </div>

                </div>

            </div>

             {/* Footer Baggage Section */}
             <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-gray-600" />
                    <span>1 free carry-on</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <span>1st checked bag free</span>
                </div>
             </div>

        </div>

        {/* Action Button Section with Total Price Context */}
        <div className="mt-8 flex justify-end items-center gap-6">
             <div className="text-right">
                <div className="text-sm text-gray-500">Total for {seats} passenger{seats > 1 ? 's' : ''}</div>
                <div className="text-2xl font-bold text-gray-900">₹{flight.price * seats}</div>
             </div>
             <Button onClick={handleBook} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base rounded-full" disabled={bookingLoading}>
                 {bookingLoading ? 'Processing...' : 'Continue to Payment'}
             </Button>
        </div>

      </div>
    </div>
  );
}
