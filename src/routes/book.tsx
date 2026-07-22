import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Calendar, Users, Coffee, Flame, UtensilsCrossed, Plane, CreditCard, ChevronRight, ChevronLeft, ArrowRight, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Contact";
import { saveBookingToFirebase } from "@/lib/firebase";

interface BookSearch {
  room?: string;
}

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    return {
      room: typeof search.room === "string" ? search.room : undefined,
    };
  },
  component: BookingPage,
});

const ROOMS = [
  {
    id: "bisoke-loft",
    name: "Bisoke Loft",
    price: 50,
    tag: "One bedroom · Deluxe Suite",
    img: "/images/bedroom-daylight.jpg",
    maxGuests: 12,
  },
  {
    id: "karisimbi-suite",
    name: "Karisimbi Suite",
    price: 50,
    tag: "One bedroom · Ambient Suite",
    img: "/images/bedroom-blue-light.jpg",
    maxGuests: 12,
  },
];

const ADDONS = [
  {
    id: "airport-transfer",
    name: "Private Airport Transfer (Kigali to Musanze)",
    price: 150,
    unit: "flat rate",
    desc: "Relax in a private 4x4 vehicle from Kigali Airport straight to the compound.",
    icon: Plane,
  },
  {
    id: "chefs-table",
    name: "Chef's Table Rwandan Fusion Dinner",
    price: 30,
    unit: "per person",
    desc: "A multi-course gourmet menu prepared privately in your suite's dining area.",
    icon: UtensilsCrossed,
  },
  {
    id: "in-room-massage",
    name: "In-Suite Therapeutic Massage",
    price: 40,
    unit: "per person",
    desc: "A 60-minute relaxing session delivered directly in the privacy of your bedroom.",
    icon: Coffee,
  },
  {
    id: "laundry-service",
    name: "Full-Stay Laundry & Valet Service",
    price: 15,
    unit: "flat rate",
    desc: "Enjoy fresh clothes every day with unlimited washing and pressing during your stay.",
    icon: Flame,
  },
];

function BookingPage() {
  const search = Route.useSearch() as BookSearch;
  const navigate = useNavigate();

  // Step 1 State: Dates, Duration & Guests
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(2);
  const [guests, setGuests] = useState(1);

  // Step 2 State: Room Selection
  const [selectedRoomId, setSelectedRoomId] = useState(search.room || "bisoke-loft");

  // Step 3 State: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Step 4 State: Billing & Payment Info
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
  const [momoNumber, setMomoNumber] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Setup default dates on mount
  useEffect(() => {
    const today = new Date();
    const defaultNights = 2;
    const checkoutDate = new Date();
    checkoutDate.setDate(today.getDate() + defaultNights);
    
    setCheckIn(today.toISOString().split("T")[0]);
    setCheckOut(checkoutDate.toISOString().split("T")[0]);
    setNights(defaultNights);
  }, []);

  const handleNightsChange = (newNights: number) => {
    const numNights = Math.max(1, Math.min(60, newNights));
    setNights(numNights);
    if (checkIn) {
      const start = new Date(checkIn);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + numNights);
        setCheckOut(end.toISOString().split("T")[0]);
      }
    }
  };

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    if (newCheckIn) {
      const start = new Date(newCheckIn);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + nights);
        setCheckOut(end.toISOString().split("T")[0]);
      }
    }
  };

  const handleCheckOutChange = (newCheckOut: string) => {
    setCheckOut(newCheckOut);
    if (checkIn && newCheckOut) {
      const start = new Date(checkIn);
      const end = new Date(newCheckOut);
      const diff = end.getTime() - start.getTime();
      const calculatedDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (calculatedDays > 0) {
        setNights(calculatedDays);
      }
    }
  };

  const selectedRoom = ROOMS.find(r => r.id === selectedRoomId) || ROOMS[0];
  const roomsRequired = Math.ceil(guests / 2);
  const roomTotal = selectedRoom.price * roomsRequired * nights;
  const discount = nights >= 7 ? Math.round(roomTotal * 0.05) : 0;
  
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find(a => a.id === addonId);
    if (!addon) return sum;
    if (addon.unit === "per person") {
      return sum + (addon.price * guests);
    }
    return sum + addon.price;
  }, 0);

  const subtotal = roomTotal - discount + addonsTotal;
  const tax = 0;
  const total = subtotal;

  const handleAddonToggle = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    setErrorMsg("");
    
    if (step === 1) {
      if (!checkIn || !checkOut) {
        setErrorMsg("Please select both check-in and check-out dates.");
        return;
      }
      if (new Date(checkIn) >= new Date(checkOut)) {
        setErrorMsg("Check-out date must be after check-in date.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (guests > selectedRoom.maxGuests) {
        setErrorMsg(`The selected room accommodates a maximum of ${selectedRoom.maxGuests} guests.`);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const sanitizeInput = (str: string) => {
    if (typeof str !== "string") return "";
    return str.replace(/<[^>]*>/g, "").trim();
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanGuestName = sanitizeInput(guestName);
    const cleanGuestEmail = sanitizeInput(guestEmail);
    const cleanGuestPhone = sanitizeInput(guestPhone);

    if (!cleanGuestName || !cleanGuestEmail || !cleanGuestPhone) {
      setErrorMsg("Please complete all guest contact fields with valid entries.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanGuestEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setErrorMsg("Please complete your credit card details.");
        return;
      }
    } else {
      if (!momoNumber) {
        setErrorMsg("Please enter your MTN Mobile Money number.");
        return;
      }
    }

    setIsProcessingPayment(true);
    setPaymentStatusMessage(
      paymentMethod === "card"
        ? "Authorizing card payment with your bank..."
        : `Sending Mobile Money prompt to ${momoNumber}...`
    );

    setTimeout(async () => {
      try {
        // Save booking to localStorage & Firebase
        const newBooking = {
          id: "PV-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          checkIn,
          checkOut,
          nights,
          guests,
          room: {
            id: selectedRoom.id,
            name: selectedRoom.name,
            price: selectedRoom.price,
            img: selectedRoom.img,
          },
          addons: selectedAddons.map(id => {
            const addon = ADDONS.find(a => a.id === id);
            return {
              id,
              name: addon?.name || "",
              price: addon?.price || 0,
              unit: addon?.unit || "",
            };
          }),
          financials: {
            subtotal,
            tax,
            total,
          },
          guest: {
            name: cleanGuestName,
            email: cleanGuestEmail,
            phone: cleanGuestPhone,
          },
          payment: {
            method: paymentMethod,
            momoNumber: paymentMethod === "momo" ? momoNumber : undefined,
          },
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        };

        // Persist to Firebase Firestore database
        await saveBookingToFirebase(newBooking);

        try {
          const existingBookingsStr = localStorage.getItem("pretty_village_bookings");
          const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
          localStorage.setItem("pretty_village_bookings", JSON.stringify([newBooking, ...existingBookings]));
          localStorage.setItem("pretty_village_active_booking", JSON.stringify(newBooking));
        } catch {
          // ignore local storage errors
        }

        setIsProcessingPayment(false);

        // Safe redirect to dashboard
        try {
          navigate({ to: "/dashboard", search: { success: "true" } });
        } catch {
          window.location.href = "/dashboard?success=true";
        }
      } catch (err) {
        console.error("Booking error:", err);
        setIsProcessingPayment(false);
        window.location.href = "/dashboard?success=true";
      }
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <Nav />

      <section className="py-12 max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Progress Header */}
        <div className="mb-12">
          <p className="eyebrow text-fern">Reservation Wizard</p>
          <h1 className="text-4xl md:text-5xl font-light mt-2">Secure your stay in Musanze</h1>
          
          {/* Steps Indicator */}
          <div className="mt-8 flex items-center justify-between max-w-2xl border-b border-border/40 pb-4">
            {[
              { num: 1, label: "Dates" },
              { num: 2, label: "Room" },
              { num: 3, label: "Add-ons" },
              { num: 4, label: "Checkout" },
            ].map(s => (
              <div key={s.num} className="flex items-center gap-2">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all ${
                  step === s.num 
                    ? "bg-fern text-forest font-semibold" 
                    : step > s.num 
                      ? "bg-forest text-mist" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className={`text-xs uppercase tracking-wider hidden sm:inline ${
                  step === s.num ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-sm max-w-4xl">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16 items-start">
          {/* Main Wizard Form */}
          <div className="bg-card border border-border/40 p-8 rounded-3xl shadow-sm min-h-[400px] flex flex-col justify-between">
            
            {/* Step 1: Dates, Duration & Guests */}
            {step === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-2xl font-light uppercase tracking-wide border-b border-border/40 pb-4">1. Dates & Duration</h2>
                
                {/* Duration Selector Section */}
                <div className="p-6 bg-fern/5 border border-fern/20 rounded-3xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <label htmlFor="nights-count" className="text-xs uppercase tracking-widest text-fern font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-fern" /> Duration of Stay (Nights)
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Select duration in nights — 7+ nights receive an automatic 5% weekly discount!
                      </p>
                    </div>

                    {/* Counter Stepper & Input */}
                    <div className="flex items-center border border-border/20 rounded-2xl overflow-hidden bg-background p-1 shadow-sm">
                      <button 
                        type="button"
                        onClick={() => handleNightsChange(nights - 1)}
                        className="w-10 h-10 hover:bg-muted/40 rounded-xl transition text-lg font-light focus:outline-none flex items-center justify-center ios-springy-btn"
                      >
                        -
                      </button>
                      <input
                        id="nights-count"
                        type="number"
                        min={1}
                        max={60}
                        value={nights}
                        onChange={e => handleNightsChange(parseInt(e.target.value) || 1)}
                        className="w-14 text-center text-sm font-semibold bg-transparent focus:outline-none"
                      />
                      <span className="text-xs font-medium text-muted-foreground mr-3 select-none">nights</span>
                      <button 
                        type="button"
                        onClick={() => handleNightsChange(nights + 1)}
                        className="w-10 h-10 hover:bg-muted/40 rounded-xl transition text-lg font-light focus:outline-none flex items-center justify-center ios-springy-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Quick Duration Preset Pills */}
                  <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-fern/10">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mr-1">Quick Presets:</span>
                    {[1, 2, 3, 5, 7, 14].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleNightsChange(n)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ios-springy-btn ${
                          nights === n 
                            ? "bg-fern text-forest font-semibold shadow-sm" 
                            : "bg-background border border-border/40 hover:border-fern text-foreground/80"
                        }`}
                      >
                        {n} {n === 1 ? "Night" : "Nights"} {n >= 7 ? "✨ (5% OFF)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="check-in" className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-fern" /> Check-in Date
                    </label>
                    <input 
                      id="check-in"
                      type="date" 
                      value={checkIn}
                      onChange={e => handleCheckInChange(e.target.value)}
                      className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="check-out" className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-fern" /> Check-out Date
                    </label>
                    <input 
                      id="check-out"
                      type="date" 
                      value={checkOut}
                      onChange={e => handleCheckOutChange(e.target.value)}
                      className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-w-xs">
                  <label htmlFor="guests-count" className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-fern" /> Number of Guests
                  </label>
                  <div className="flex items-center border border-border/20 rounded-2xl overflow-hidden bg-muted/40 p-1">
                    <button 
                      type="button"
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 hover:bg-white/40 rounded-xl transition text-lg font-light focus:outline-none flex items-center justify-center ios-springy-btn"
                    >
                      -
                    </button>
                    <span id="guests-count" className="flex-1 text-center text-sm font-medium">{guests}</span>
                    <button 
                      type="button"
                      onClick={() => setGuests(prev => Math.min(12, prev + 1))}
                      className="w-10 h-10 hover:bg-white/40 rounded-xl transition text-lg font-light focus:outline-none flex items-center justify-center ios-springy-btn"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    Each suite ($50/night) fits up to 2 guests (1 guest + optional companion). Allocated: <strong className="text-fern font-medium">{roomsRequired} {roomsRequired === 1 ? "suite" : "suites"} (${roomsRequired * 50}/night)</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Room Selection */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-2xl font-light uppercase tracking-wide border-b border-border/40 pb-4">2. Select Your Residence</h2>
                <div className="grid gap-6">
                  {ROOMS.map(r => {
                    const isSelected = selectedRoomId === r.id;
                    const tooManyGuests = guests > r.maxGuests;
                    
                    return (
                      <div 
                        key={r.id}
                        onClick={() => !tooManyGuests && setSelectedRoomId(r.id)}
                        className={`group relative grid sm:grid-cols-[160px_1fr] border rounded-2xl overflow-hidden cursor-pointer transition ios-springy ${
                          isSelected 
                            ? "border-fern bg-fern/5 shadow-md scale-[1.01]" 
                            : tooManyGuests 
                              ? "opacity-45 cursor-not-allowed border-border/40" 
                              : "border-border/60 hover:border-fern bg-background hover:bg-muted/10"
                        }`}
                      >
                        <div className="relative aspect-[4/3] sm:aspect-auto">
                          <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="text-xl font-light text-foreground">{r.name}</h3>
                              <p className="text-lg text-fern font-medium">${r.price} <span className="text-xs font-light text-muted-foreground">/ night</span></p>
                            </div>
                            <p className="text-xs eyebrow text-muted-foreground/80 mt-1">{r.tag}</p>
                            <p className="text-xs text-muted-foreground mt-2">Accommodates up to {r.maxGuests} guests</p>
                          </div>
                          
                          {tooManyGuests && (
                            <p className="text-xs text-destructive mt-3 font-medium">Exceeds maximum guest occupancy ({r.maxGuests} max)</p>
                          )}
                          
                          {isSelected && (
                            <span className="absolute bottom-4 right-4 flex items-center justify-center w-7 h-7 rounded-full bg-fern text-forest shadow-md animate-scaleIn">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Add-ons */}
            {step === 3 && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-2xl font-light uppercase tracking-wide border-b border-border/40 pb-4">3. Enhance Your Stay</h2>
                <p className="text-sm font-light text-muted-foreground">Choose from our handpicked on-site services to make your stay completely relaxed.</p>
                
                <div className="grid gap-6">
                  {ADDONS.map(a => {
                    const isSelected = selectedAddons.includes(a.id);
                    const AddonIcon = a.icon;
                    return (
                      <div 
                        key={a.id}
                        onClick={() => handleAddonToggle(a.id)}
                        className={`flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition ios-springy ${
                          isSelected 
                            ? "border-fern bg-fern/5 shadow-md scale-[1.01]" 
                            : "border-border/60 hover:border-fern bg-background hover:bg-muted/10"
                        }`}
                      >
                        <div className={`p-3.5 rounded-xl ${isSelected ? "bg-fern/10 text-fern" : "bg-muted text-muted-foreground"} mt-1 transition-colors`}>
                          <AddonIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-medium text-sm text-foreground">{a.name}</h3>
                            <p className="text-sm text-fern font-medium">
                              +${a.price} <span className="text-xs font-light text-muted-foreground">{a.unit}</span>
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{a.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-1 transition-all ${
                          isSelected ? "bg-fern border-fern text-forest shadow-sm" : "border-border/60 bg-background"
                        }`}>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Checkout */}
            {step === 4 && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-8 animate-fadeIn">
                <h2 className="text-2xl font-light uppercase tracking-wide border-b border-border/40 pb-4">4. Guest Contact & Payment</h2>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Contact Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fullname" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <input 
                        id="fullname"
                        type="text" 
                        required
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</label>
                      <input 
                        id="email"
                        type="email" 
                        required
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</label>
                      <input 
                        id="phone"
                        type="tel" 
                        required
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated Payment */}
                <div className="space-y-5 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-fern" /> Payment Information
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-fern bg-fern/10 px-2.5 py-1 rounded-full font-semibold">Sandbox Mode</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-muted/30 border border-border/20 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3.5 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ios-springy-btn ${
                        paymentMethod === "card"
                          ? "bg-forest text-mist shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("momo");
                        if (!momoNumber) setMomoNumber(guestPhone);
                      }}
                      className={`py-3.5 rounded-xl text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ios-springy-btn ${
                        paymentMethod === "momo"
                          ? "bg-forest text-mist shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" /> MoMo Pay
                    </button>
                  </div>
                  
                  {paymentMethod === "card" ? (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="cardnum" className="text-xs uppercase tracking-widest text-muted-foreground">Card Number</label>
                        <input 
                          id="cardnum"
                          type="text" 
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                            setCardNumber(formatted);
                          }}
                          className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all tracking-widest"
                          placeholder="4000 1234 5678 9010"
                        />
                      </div>

                      <div className="grid gap-4 grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cardexp" className="text-xs uppercase tracking-widest text-muted-foreground">Expiry (MM/YY)</label>
                          <input 
                            id="cardexp"
                            type="text" 
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={e => {
                              const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (clean.length >= 3) {
                                setCardExpiry(clean.slice(0, 2) + "/" + clean.slice(2));
                              } else {
                                setCardExpiry(clean);
                              }
                            }}
                            className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all tracking-widest"
                            placeholder="12/28"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cardcvc" className="text-xs uppercase tracking-widest text-muted-foreground">CVC</label>
                          <input 
                            id="cardcvc"
                            type="password" 
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))}
                            className="p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all tracking-widest"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="momonum" className="text-xs uppercase tracking-widest text-muted-foreground">MTN Mobile Money Number</label>
                        <div className="flex gap-2">
                          <div className="bg-amber-500/10 border border-amber-500/20 px-4 rounded-2xl text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center tracking-widest select-none">
                            MTN
                          </div>
                          <input 
                            id="momonum"
                            type="tel" 
                            required
                            value={momoNumber}
                            onChange={e => setMomoNumber(e.target.value)}
                            className="flex-1 p-4 bg-muted/40 border-0 rounded-2xl text-sm focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/40 transition-all tracking-widest"
                            placeholder="0788 123 456"
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                          Enter your active MoMo wallet number. A push authorization prompt will pop up on your phone screen.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button inside form for step 4 */}
                <button
                  type="submit"
                  className="w-full mt-8 bg-fern text-forest font-semibold uppercase tracking-[0.25em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 transition hover:bg-mist hover:text-forest ios-springy-btn shadow-md animate-pulse"
                >
                  Pay & Confirm Booking (${total.toLocaleString()}) <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Navigation buttons for steps 1-3 */}
            {step < 4 && (
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/40">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition ios-springy-btn"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}
                
                <button
                  onClick={handleNextStep}
                  className="bg-forest text-mist font-medium uppercase tracking-[0.25em] text-xs px-8 py-4 rounded-2xl flex items-center gap-2 transition hover:bg-fern hover:text-forest shadow-md ios-springy-btn"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Booking Summary Column */}
          <div className="border border-border/60 bg-card p-6 md:p-8 rounded-3xl shadow-sm sticky top-28">
            <h3 className="text-lg font-light uppercase tracking-wider mb-6 border-b border-border/40 pb-3">Booking Summary</h3>
            
            <div className="space-y-6">
              {/* Room details summary */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  <img src={selectedRoom.img} alt={selectedRoom.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{selectedRoom.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">${selectedRoom.price} / night</p>
                  <p className="text-xs text-fern font-medium mt-1 uppercase tracking-widest">{selectedRoom.tag}</p>
                </div>
              </div>

              {/* Dates & duration summary */}
              <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-4 text-xs uppercase tracking-wider">
                <div>
                  <p className="text-[10px] text-muted-foreground">Check-in</p>
                  <p className="font-semibold mt-1 text-foreground">{checkIn || "Not set"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Check-out</p>
                  <p className="font-semibold mt-1 text-foreground">{checkOut || "Not set"}</p>
                </div>
                <div className="col-span-2 flex justify-between pt-2 border-t border-border/20">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold">{nights} {nights === 1 ? "night" : "nights"}</span>
                </div>
                <div className="col-span-2 flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-semibold">{guests} {guests === 1 ? "guest" : "guests"}</span>
                </div>
              </div>

              {/* Add-ons summary */}
              {selectedAddons.length > 0 && (
                <div className="space-y-2 text-xs">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Selected Upgrades</p>
                  {selectedAddons.map(addonId => {
                    const addon = ADDONS.find(a => a.id === addonId);
                    if (!addon) return null;
                    const pricing = addon.unit === "per person" ? addon.price * guests : addon.price;
                    return (
                      <div key={addonId} className="flex justify-between items-center text-foreground/80 py-1">
                        <span className="truncate max-w-[180px]">{addon.name}</span>
                        <span className="font-medium font-mono">${pricing.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="border-t border-border/40 pt-4 space-y-2 text-sm font-light">
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>{selectedRoom.name} ({roomsRequired} {roomsRequired === 1 ? "suite" : "suites"} × {nights} {nights === 1 ? "night" : "nights"})</span>
                  <span className="font-mono">${roomTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
                    <span>Weekly Discount (5% off)</span>
                    <span className="font-mono">-${discount.toLocaleString()}</span>
                  </div>
                )}
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Services & Upgrades</span>
                    <span className="font-mono">${addonsTotal.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-end text-foreground font-semibold pt-4 border-t border-border/40">
                  <span className="text-xs uppercase tracking-widest">Total Cost</span>
                  <span className="text-2xl font-light text-fern font-mono">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Payment Processing Glassmorphic Modal */}
      <AnimatePresence>
        {isProcessingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background max-w-sm w-full p-8 rounded-3xl border border-border/40 text-center shadow-2xl flex flex-col items-center gap-6 animate-fadeIn"
            >
              {/* Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-muted rounded-full" />
                <div className="absolute inset-0 border-4 border-fern border-t-transparent rounded-full animate-spin" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-foreground">Processing Payment</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-light">
                  {paymentStatusMessage}
                </p>
              </div>

              {paymentMethod === "momo" && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20 leading-relaxed max-w-[280px] text-left">
                  <strong>Instruction:</strong> Please keep your mobile phone unlocked. You will see an MTN USSD prompt asking for your MoMo PIN. Enter it to approve.
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
