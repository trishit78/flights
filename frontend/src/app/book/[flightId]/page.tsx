'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Flight {
  id: number;
  flightNumber: string;
  price: number;
  departureAirportId: string;
  arrivalAirportId: string;
  totalSeats: number;
}

export default function BookingPage() {
  const { flightId } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const fetchFlight = async () => {
      try {
        // Fetch specific flight details
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
        debugger;
      // 1. Create Booking
      const response = await api.post('/bookingService/api/v1/booking', {
        flightId: Number(flightId),
        noOfSeats: Number(seats)
      });

      const bookingData = response.data.data; // Should contain bookingId and totalCost
      
      // 2. Redirect to Payment Page
      router.push(`/book/${flightId}/payment?bookingId=${bookingData.id}&amount=${bookingData.totalCost}`);

    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.response?.data?.message || 'Booking failed');
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading booking details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!flight) return <div className="p-8 text-center">Flight not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Confirm Booking</CardTitle>
          <CardDescription>Flight {flight.flightNumber} • {flight.departureAirportId} to {flight.arrivalAirportId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 border rounded-lg bg-muted/20">
            <span className="font-medium">Price per seat</span>
            <span className="font-bold text-lg">${flight.price}</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Seats</label>
            <Input 
              type="number" 
              min={1} 
              max={flight.totalSeats} // Assuming totalSeats available 
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg bg-primary/10 border-primary/20">
            <span className="font-bold">Total Cost</span>
            <span className="font-bold text-2xl text-primary">${flight.price * seats}</span>
          </div>
          
          {error && <div className="text-sm text-destructive">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleBook} className="w-full" size="lg" disabled={bookingLoading}>
            {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
