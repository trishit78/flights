'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { CheckCircle2, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showToast, setShowToast] = useState(false);

  // Payment method state (visual only)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bancontact' | 'ideal'>('card');

  useEffect(() => {
    if (success) return; // Stop timer on success

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowToast(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success]);

  // Auto-hide toast after a few seconds if desired, but for this use case 
  // it might be better to keep it visible as the session is dead.
  // useEffect(() => {
  //   if (showToast) {
  //     const timer = setTimeout(() => setShowToast(false), 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showToast]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft === 0) return;

    setLoading(true);
    setError('');

    try {
      const idempotencyKey = uuidv4();
      await api.post('/bookingService/api/v1/booking/payments', {
        bookingId: Number(bookingId),
        totalCost: Number(amount),
        userId: JSON.parse(localStorage.getItem('user') || '{}').id 
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-green-500/20 bg-white shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription>Your booking has been confirmed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">A confirmation email has been sent to your registered email address.</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/" className="w-full">
               <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">Return Home</Button>
            </Link>
            <Link href="/flights" className="w-full">
               <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Another Flight</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-lg shadow-lg max-w-sm w-full"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Session Expired</h3>
              <p className="text-sm opacity-90">Payment cannot be completed as the time has exhausted.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-[500px] border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden text-gray-900">
        
        <CardContent className="p-8">
          
          {/* Dummy Payment Header with Timer */}
          <div className="mb-6 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Dummy Payment</h2>
                <p className="text-sm text-gray-500 mt-1">Complete your transaction securely</p>
            </div>
            <div className={`flex flex-col items-end`}>
                <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Time Remaining</span>
                <div className={`text-xl font-mono font-bold px-4 py-2 rounded-lg border ${timeLeft < 60 ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-900 bg-gray-50 border-gray-200'}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex gap-3 mb-6">
            <div 
              className={`flex-1 flex flex-col items-start gap-1 p-3 rounded-lg border cursor-pointer transition-all ${
                paymentMethod === 'card' 
                  ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-700'}`}>Card</span>
            </div>
            
            <div 
              className={`flex-1 flex flex-col items-start gap-1 p-3 rounded-lg border cursor-pointer transition-all ${
                paymentMethod === 'bancontact'
                  ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('bancontact')}
            >
               <div className="w-5 h-5 bg-yellow-400 rounded-sm mb-0.5"></div> {/* Mock Icon */}
              <span className="text-sm font-medium text-gray-700">Bancontact</span>
            </div>

             <div 
              className={`flex-1 flex flex-col items-start gap-1 p-3 rounded-lg border cursor-pointer transition-all ${
                paymentMethod === 'ideal' 
                   ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500' 
                   : 'border-gray-200 hover:border-gray-300'
              }`}
               onClick={() => setPaymentMethod('ideal')}
            >
              <div className="w-5 h-5 bg-pink-500 rounded-sm mb-0.5"></div> {/* Mock Icon */}
              <span className="text-sm font-medium text-gray-700">iDEAL</span>
            </div>

            <div className="w-12 flex items-center justify-center rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <span className="text-gray-400 text-xl leading-none pb-2">...</span>
            </div>
          </div>


          <form onSubmit={handlePayment} className="space-y-5">
            
            {/* Card Number */}
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600">Card number</label>
              <div className="relative">
                <Input 
                    defaultValue="4242 4242 4242 4242"
                    placeholder="1234 1234 1234 1234" 
                    className="pr-24 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                    disabled={timeLeft === 0}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {/* Mock Card Brand Icons */}
                    <div className="w-8 h-5 bg-blue-900 rounded-sm flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                    <div className="w-8 h-5 bg-red-500 rounded-sm flex items-center justify-center flex-col gap-[2px]">
                        <div className="w-3 h-3 bg-red-800 rounded-full opacity-80 -mb-1"></div>
                        <div className="w-3 h-3 bg-orange-500 rounded-full opacity-80"></div>
                    </div>
                    <div className="w-8 h-5 bg-blue-400 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
                </div>
              </div>
            </div>

            {/* Expiry & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Expiry</label>
                <Input defaultValue="12/30" placeholder="MM / YY" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500" disabled={timeLeft === 0} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">CVC</label>
                <div className="relative">
                    <Input defaultValue="123" placeholder="CVC" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500" disabled={timeLeft === 0} />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Country & PIN */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-sm text-gray-600">Country</label>
                <select 
                    defaultValue="India"
                    className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={timeLeft === 0}
                >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-600">PIN</label>
                <Input defaultValue="110001" placeholder="PIN Code" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500" disabled={timeLeft === 0} />
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                By providing your card information, you allow Techfolia to charge your card for future payments in accordance with their terms.
            </p>
            
            {/* Error Message */}
            {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
            
            {/* Pay Button / Home Button */}
            {timeLeft > 0 ? (
                <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-[#4F46E5] hover:bg-[#4338ca] shadow-md shadow-indigo-200 mt-2" 
                    disabled={loading}
                >
                    {loading ? 'Processing...' : `Pay Now ₹${amount}`}
                </Button>
            ) : (
                <Link href="/" className="w-full mt-2 block">
                    <Button type="button" variant="outline" className="w-full h-12 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50">
                        Session Expired - Return to Home
                    </Button>
                </Link>
            )}

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
