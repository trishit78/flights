'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plane, Search, Calendar, MapPin } from "lucide-react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to flights page with query params (or just all flights for now if empty)
    const query = new URLSearchParams(searchParams).toString();
    router.push(`/flights?${query}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-[600px] border-b border-border/40 bg-background overflow-hidden px-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="relative z-10 w-full max-w-5xl space-y-8 text-center">
          <div className="space-y-4">
             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Discover Your Next <br /> <span className="text-primary">Adventure</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Seamlessly book flights to destinations around the globe. Experience travel like never before.
            </p>
          </div>

          <Card className="mx-auto max-w-3xl bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4 items-end">
                <div className="space-y-2 text-left">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="Origin" 
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">To</label>
                   <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      placeholder="Destination" 
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                    />
                   </div>
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Date</label>
                   <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      className="pl-9" 
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                    />
                   </div>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Plane className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Global Coverage</CardTitle>
              <CardDescription>Major airlines connecting you to thousands of cities.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Flexible Booking</CardTitle>
              <CardDescription>Easy cancellation and modification policies.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Best Prices</CardTitle>
              <CardDescription>Competitive rates and exclusive deals for members.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
