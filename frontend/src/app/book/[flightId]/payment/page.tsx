'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const idempotencyKey = uuidv4();
      await api.post('/bookingService/api/v1/booking/payments', {
        bookingId: Number(bookingId),
        totalCost: Number(amount),
        userId: JSON.parse(localStorage.getItem('user') || '{}').id // Pass userId if needed or backend takes from token
      }, {
        headers: {
            'x-idempotency-key': idempotencyKey
        }
      });
      
      setSuccess(true);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md text-center border-green-500/20 bg-green-500/5">
          <CardHeader>
            <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700 dark:text-green-500">Payment Successful!</CardTitle>
            <CardDescription>Your booking has been confirmed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">A confirmation email has been sent to your registered email address.</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link href="/" className="w-full">
               <Button variant="outline" className="w-full">Return Home</Button>
            </Link>
            <Link href="/flights" className="w-full">
               <Button className="w-full">Book Another Flight</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" /> Payment
          </CardTitle>
          <CardDescription>Complete your transaction securely</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/30 rounded-lg text-center">
             <div className="text-sm text-muted-foreground">Amount to Pay</div>
             <div className="text-3xl font-bold">${amount}</div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <Input placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry</label>
                <Input placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVC</label>
                <Input placeholder="123" />
              </div>
            </div>
            
            {error && <div className="text-sm text-destructive">{error}</div>}
            
            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? 'Processing...' : `Pay $${amount}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
