'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { PlaneTakeoff, PlaneLanding, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Flight {
  id: number;
  flightNumber: string;
  price: number;
  departureAirportId: string;
  arrivalAirportId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
}

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // In a real app, pass searchParams to the API
        const response = await api.get('/flightsService/api/v1/flight');
        const allFlights: Flight[] = response.data.data;
        
         // Simple client-side filtering for demo purposes if API doesn't support generic filtering
        const from = searchParams.get('from')?.toLowerCase();
        const to = searchParams.get('to')?.toLowerCase();
        
        const filtered = allFlights.filter(f => {
           if (from && !f.departureAirportId.toLowerCase().includes(from)) return false;
           if (to && !f.arrivalAirportId.toLowerCase().includes(to)) return false;
           return true;
        });

        setFlights(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  if (loading) return <div className="p-8 text-center">Loading flights...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Flights</h1>
      
      {flights.length === 0 ? (
        <div className="text-center text-muted-foreground">No flights found matching your criteria.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {flights.map((flight) => (
            <Card key={flight.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{flight.flightNumber}</span>
                  <span className="text-primary font-bold text-lg">${flight.price}</span>
                </CardTitle>
                <CardDescription>Flight ID: {flight.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-start gap-1">
                     <span className="flex items-center text-muted-foreground"><PlaneTakeoff className="h-4 w-4 mr-1" /> Departure</span>
                     <span className="font-semibold">{flight.departureAirportId}</span>
                     <span>{new Date(flight.departureTime).toLocaleTimeString()}</span>
                     <span className="text-xs text-muted-foreground">{new Date(flight.departureTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block w-12 border-t border-dashed border-muted-foreground my-2" />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                   <div className="flex flex-col items-end gap-1">
                     <span className="flex items-center text-muted-foreground">Arrival <PlaneLanding className="h-4 w-4 ml-1" /></span>
                     <span className="font-semibold">{flight.arrivalAirportId}</span>
                     <span>{new Date(flight.arrivalTime).toLocaleTimeString()}</span>
                     <span className="text-xs text-muted-foreground">{new Date(flight.arrivalTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Link href={`/book/${flight.id}`} className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
