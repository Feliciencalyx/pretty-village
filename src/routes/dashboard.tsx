import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Check, Calendar, MapPin, MessageSquare, Send, CloudRain, Sun, Cloud, AlertCircle, Compass, CreditCard, Sparkles, User } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Contact";

interface DashboardSearch {
  success?: string;
}

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      success: typeof search.success === "string" ? search.success : undefined,
    };
  },
  component: DashboardPage,
});

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  room: {
    id: string;
    name: string;
    price: number;
    img: string;
  };
  addons: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
  }>;
  financials: {
    subtotal: number;
    tax: number;
    total: number;
  };
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  createdAt: string;
}

// Fallback demo booking if none exists
const DEMO_BOOKING: Booking = {
  id: "PV-789X9",
  checkIn: new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0],
  checkOut: new Date(Date.now() + 86400000 * 13).toISOString().split("T")[0],
  nights: 3,
  guests: 2,
  room: {
    id: "bisoke-loft",
    name: "Bisoke Loft",
    price: 50,
    img: "/images/bedroom-daylight.jpg",
  },
  addons: [
    {
      id: "airport-transfer",
      name: "Private Airport Transfer (Kigali to Musanze)",
      price: 150,
      unit: "flat rate",
    }
  ],
  financials: {
    subtotal: 300,
    tax: 0,
    total: 300,
  },
  guest: {
    name: "Aline Umuhoza",
    email: "aline@example.com",
    phone: "+250 788 111 222",
  },
  status: "Confirmed",
  createdAt: new Date().toISOString(),
};

interface Message {
  id: string;
  sender: "guest" | "concierge";
  text: string;
  time: string;
}

const QUICK_REQUESTS = [
  { text: "Request early check-in (12:00 PM)", response: "Hello! We would love to accommodate your request. The housekeepers will prioritize your suite, making it ready by 12:00 PM instead of our standard 3:00 PM. Have a safe journey!" },
  { text: "Order room breakfast service", response: "Good morning! Our head chef is delighted. We've scheduled a traditional breakfast (fresh bananas, local honey, organic eggs, and single-origin coffee) to be served on your private balcony at 8:30 AM." },
  { text: "Request two extra pillows", response: "Of course! We will instruct housekeeping to place two additional down-alternative pillows and an extra wool blanket in your closet prior to your check-in." },
  { text: "Book an evening spa massage", response: "Excellent choice! We have reserved a private 60-minute volcanic basalt hot-stone massage for you on your second evening at 5:30 PM. Relax and enjoy!" }
];

function DashboardPage() {
  const search = Route.useSearch() as DashboardSearch;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(search.success === "true");

  // Chat simulator states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "concierge",
      text: "Mwiriwe! Welcome to the Pretty Village digital portal. I'm your host, Jean-Paul. How can I assist you with your upcoming stay?",
      time: "10:15 AM",
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load booking from localStorage
    const savedActive = localStorage.getItem("pretty_village_active_booking");
    if (savedActive) {
      setBooking(JSON.parse(savedActive));
      setIsDemo(false);
    } else {
      // Set demo booking if none is found
      setBooking(DEMO_BOOKING);
      setIsDemo(true);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!booking) return null;

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Append guest message
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "guest",
      text,
      time: timeStr,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate reply
    setTimeout(() => {
      // Find matching quick response or use fallback
      const matchingQuick = QUICK_REQUESTS.find(q => q.text === text);
      const replyText = matchingQuick 
        ? matchingQuick.response 
        : "Thank you for your message. I've noted down your request and passed it to our on-site team. We will get back to you shortly!";

      const conciergeMsg: Message = {
        id: Math.random().toString(),
        sender: "concierge",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, conciergeMsg]);
    }, 1200);
  };

  const handleQuickRequest = (reqText: string) => {
    handleSendMessage(reqText);
  };

  const cancelActiveBooking = () => {
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      localStorage.removeItem("pretty_village_active_booking");
      // Remove from bookings array as well
      const savedBookings = localStorage.getItem("pretty_village_bookings");
      if (savedBookings) {
        const bookingsList = JSON.parse(savedBookings) as Booking[];
        const filtered = bookingsList.filter(b => b.id !== booking.id);
        localStorage.setItem("pretty_village_bookings", JSON.stringify(filtered));
      }
      
      // Reload page to reset back to demo or empty
      window.location.reload();
    }
  };

  const getWhatsAppLink = (phone: string = "250792500176") => {
    if (!booking) return "#";
    const guestName = booking.guest?.name || "Guest";
    const guestEmail = booking.guest?.email || "N/A";
    const guestPhone = booking.guest?.phone || "N/A";
    const roomName = booking.room?.name || "Pretty Village Suite";
    const totalAmount = booking.financials?.total ?? 0;
    const addonsList = (booking.addons && booking.addons.length > 0)
      ? booking.addons.map(a => `- ${a.name}`).join("\n")
      : "- None";

    const text = encodeURIComponent(
`*🏡 WEBSITE ONLINE BOOKING - Pretty Village Musanze* ✨
-----------------------------------------
*Source:* Official Website
*Booking ID:* ${booking.id || "PV-RESERVATION"}
*Guest Name:* ${guestName}
*Email:* ${guestEmail}
*Phone:* ${guestPhone}

*Suite:* ${roomName}
*Check-in:* ${booking.checkIn || "N/A"}
*Check-out:* ${booking.checkOut || "N/A"}
*Duration:* ${booking.nights || 1} nights
*Guests:* ${booking.guests || 1} guest(s)

*Upgrades Selected:*
${addonsList}

*Total to be Paid (Pay on Arrival):* $${totalAmount.toLocaleString()}
-----------------------------------------
Thank you! Please confirm my stay.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const getEmailLink = () => {
    if (!booking) return "#";
    const guestName = booking.guest?.name || "Guest";
    const guestEmail = booking.guest?.email || "N/A";
    const guestPhone = booking.guest?.phone || "N/A";
    const roomName = booking.room?.name || "Pretty Village Suite";
    const totalAmount = booking.financials?.total ?? 0;
    const addonsList = (booking.addons && booking.addons.length > 0)
      ? booking.addons.map(a => `- ${a.name}`).join("\n")
      : "- None";

    const subject = encodeURIComponent(`🌐 [Website Reservation] Booking Confirmation - ${guestName} (${booking.id || "PV-RESERVATION"})`);
    const body = encodeURIComponent(
`Dear Pretty Village Management,

Please find the details for my website booking reservation below:

Source: Official Website
Booking ID: ${booking.id || "PV-RESERVATION"}
Guest Name: ${guestName}
Email: ${guestEmail}
Phone: ${guestPhone}

Suite: ${roomName}
Check-in: ${booking.checkIn || "N/A"}
Check-out: ${booking.checkOut || "N/A"}
Duration: ${booking.nights || 1} nights
Guests: ${booking.guests || 1} guest(s)

Upgrades Selected:
${addonsList}

Total to be Paid (Pay on Arrival): $${totalAmount.toLocaleString()}

Please review and confirm my stay.

Best regards,
${guestName}`
    );
    return `mailto:prettyvillagee@gmail.com,feliciencalylx@gmail.com?subject=${subject}&body=${body}`;
  };

  const welcomeName = booking.guest?.name ? booking.guest.name.split(" ")[0] : "Guest";

  return (
    <main className="min-h-screen bg-background text-foreground pt-24">
      <Nav />

      <section className="py-12 max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow text-fern">Guest Portal</p>
            <h1 className="text-4xl md:text-5xl font-light mt-2">Welcome, {welcomeName}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
            {isDemo ? (
              <span className="bg-amber-500/10 text-amber-600 border border-amber-500/25 px-4 py-2 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Demo Reservation
              </span>
            ) : (
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 px-4 py-2 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4" /> Active Booking
              </span>
            )}
            {isDemo && (
              <Link to="/book" className="bg-fern text-forest px-4 py-2 rounded-xl hover:bg-forest hover:text-mist transition ios-springy-btn">
                Create Custom Stay
              </Link>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {showSuccessAlert && (
          <div className="mb-10 p-6 bg-fern/10 border border-fern/30 rounded-3xl max-w-5xl flex items-start gap-4 animate-slideDown">
            <div className="p-2 bg-fern/20 text-fern rounded-full">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg text-foreground">Stay Confirmed!</h3>
              <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                Your reservation at Pretty Village has been processed successfully. 
                <strong className="block mt-2 text-foreground font-semibold">Action Required:</strong> To finalize check-in protocols and coordinate your key handoff, click below to submit your details directly to our hosts on WhatsApp and Email:
              </p>
              
              <div className="flex gap-3 flex-wrap mt-4">
                <a
                  href={getWhatsAppLink("250792500176")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3.5 rounded-xl hover:bg-[#20ba59] transition flex items-center gap-2 ios-springy-btn shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" /> Send via WhatsApp
                </a>
                <a
                  href={getEmailLink()}
                  className="bg-forest text-mist text-xs font-semibold uppercase tracking-widest px-5 py-3.5 rounded-xl hover:bg-moss hover:text-mist transition flex items-center gap-2 ios-springy-btn shadow-sm"
                >
                  <Send className="w-4 h-4" /> Send via Email
                </a>
              </div>

              <button 
                onClick={() => setShowSuccessAlert(false)}
                className="mt-4 text-xs uppercase tracking-widest text-fern font-medium hover:underline block animate-fadeIn"
              >
                Dismiss notification
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-10">
            {/* Stay Details Card */}
            <div className="border border-border/40 bg-card rounded-3xl shadow-sm overflow-hidden">
              <div className="relative h-64 bg-forest flex items-end">
                <img src={booking.room?.img || "/images/bedroom-daylight.jpg"} alt={booking.room?.name || "Suite"} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between w-full gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-fern font-semibold bg-forest/80 px-2 py-0.5 rounded-full">Residence</span>
                    <h2 className="text-3xl font-light text-mist mt-1">{booking.room?.name || "Boutique Suite"}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-mist/60">Booking ID</p>
                    <p className="font-mono text-base font-medium text-mist">{booking.id || "PV-789X9"}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xs eyebrow text-muted-foreground border-b border-border/40 pb-2">Stay Parameters</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4 text-fern" /> {booking.checkIn || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium flex items-center gap-1.5"><Calendar className="w-4 h-4 text-fern" /> {booking.checkOut || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{booking.nights || 1} nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium">{booking.guests || 1} guests</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs eyebrow text-muted-foreground border-b border-border/40 pb-2">Billing Invoice</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Base Stay Subtotal</span>
                      <span className="font-mono font-medium">${(booking.financials?.subtotal ?? 0).toLocaleString()}</span>
                    </div>
                    {(booking.financials?.tax ?? 0) > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tourism Tax</span>
                        <span className="font-mono font-medium">${(booking.financials?.tax ?? 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-border/40 text-fern">
                      <span className="font-light text-xs uppercase tracking-wider text-foreground">Total to be Paid (Pay on Arrival)</span>
                      <span className="font-mono">${(booking.financials?.total ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {booking.addons.length > 0 && (
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xs eyebrow text-muted-foreground border-b border-border/40 pb-2">Confirmed Experiences</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {booking.addons.map(addon => (
                        <div key={addon.id} className="p-3 bg-muted/30 border border-border/40 rounded-2xl flex items-center justify-between text-sm">
                          <span className="truncate max-w-[200px] font-medium">{addon.name}</span>
                          <span className="text-xs text-fern bg-fern/10 px-2 py-0.5 rounded-full font-semibold">Confirmed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Reservation to WhatsApp and Email (Dynamic link triggers) */}
                {!isDemo && (
                  <div className="md:col-span-2 p-5 bg-fern/5 border border-fern/20 rounded-2xl space-y-4 animate-fadeIn">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-fern font-semibold">Submit Booking details to Hosts</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                        Please send your reservation details to our management team on WhatsApp and Email to secure direct arrival support.
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <a
                        href={getWhatsAppLink("250792500176")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3.5 rounded-xl hover:bg-[#20ba59] transition flex items-center gap-2 ios-springy-btn shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" /> Send via WhatsApp
                      </a>
                      <a
                        href={getEmailLink()}
                        className="bg-forest text-mist text-xs font-semibold uppercase tracking-widest px-5 py-3.5 rounded-xl hover:bg-moss hover:text-mist transition flex items-center gap-2 ios-springy-btn shadow-sm"
                      >
                        <Send className="w-4 h-4" /> Send via Email
                      </a>
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 pt-4 border-t border-border/40 flex justify-between items-center flex-wrap gap-4">
                  <p className="text-xs text-muted-foreground">To reschedule or edit guest information, use the concierge chat.</p>
                  {!isDemo && (
                    <button 
                      onClick={cancelActiveBooking}
                      className="text-xs uppercase tracking-wider text-destructive hover:underline font-semibold"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Concierge Chat Box */}
            <div className="border border-border/40 bg-card rounded-3xl shadow-sm flex flex-col h-[500px] overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/40 flex items-center justify-between bg-forest text-mist">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fern/20 border border-fern/30 flex items-center justify-center text-fern">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Concierge Host</h3>
                    <p className="text-[10px] text-fern uppercase tracking-widest font-semibold">Active helper</p>
                  </div>
                </div>
                <MessageSquare className="w-5 h-5 opacity-60" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-background/40">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === "guest" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "guest" 
                        ? "bg-forest text-mist rounded-tr-none border border-forest/10" 
                        : "bg-card text-foreground rounded-tl-none border border-border/40 shadow-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-muted-foreground uppercase mt-1 tracking-wider">{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic mr-auto bg-card border border-border/40 p-3 rounded-2xl">
                    <span className="w-1.5 h-1.5 bg-fern rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-fern rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-fern rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span>Jean-Paul is typing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions Grid */}
              <div className="p-3 border-t border-border/40 bg-muted/10">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 ml-1">Quick Concierge Requests</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REQUESTS.map(q => (
                    <button
                      key={q.text}
                      onClick={() => handleQuickRequest(q.text)}
                      disabled={isTyping}
                      className="text-xs bg-card border border-border/40 px-3 py-1.5 rounded-xl hover:border-fern hover:bg-fern/5 transition text-foreground/80 hover:text-foreground disabled:opacity-50 ios-springy-btn"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/40 flex gap-2 bg-card">
                <input
                  type="text"
                  placeholder="Ask for custom requests..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage(inputVal)}
                  disabled={isTyping}
                  className="flex-1 p-3 border border-border/40 rounded-2xl text-sm bg-background focus:outline-none focus:border-fern disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendMessage(inputVal)}
                  disabled={!inputVal.trim() || isTyping}
                  className="bg-forest text-mist p-3 rounded-2xl hover:bg-fern hover:text-forest transition flex items-center justify-center disabled:opacity-50 ios-springy-btn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Musanze Weather Widget */}
            <div className="border border-border/40 bg-card p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-base font-light uppercase tracking-wider border-b border-border/40 pb-3 flex items-center justify-between">
                <span>Musanze Climate</span>
                <span className="text-[10px] text-fern uppercase tracking-widest font-mono">Live Sync</span>
              </h3>

              <div className="flex items-center gap-6 justify-center py-4 bg-background/30 rounded-2xl border border-border/20">
                <div className="p-3 bg-fern/10 text-fern rounded-full">
                  <Cloud className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-3xl font-light font-mono text-foreground">19°C</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Highland Mist</p>
                </div>
              </div>

              <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <Compass className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-xs uppercase tracking-wider text-emerald-800">Property Status</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Quiet and peaceful compound. Gated security is active and front lobby staffed 24/7.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 border border-border/40 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground">Friday</p>
                    <Sun className="w-4 h-4 text-amber-500 mx-auto my-2" />
                    <p className="font-medium">21°C</p>
                  </div>
                  <div className="p-2 border border-border/40 rounded-2xl bg-muted/20">
                    <p className="text-[10px] text-muted-foreground">Saturday</p>
                    <CloudRain className="w-4 h-4 text-blue-400 mx-auto my-2" />
                    <p className="font-medium">17°C</p>
                  </div>
                  <div className="p-2 border border-border/40 rounded-2xl">
                    <p className="text-[10px] text-muted-foreground">Sunday</p>
                    <Cloud className="w-4 h-4 text-gray-400 mx-auto my-2" />
                    <p className="font-medium">19°C</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Experience Upgrades Post-Booking */}
            <div className="border border-border/40 bg-card p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <h3 className="text-base font-light uppercase tracking-wider border-b border-border/40 pb-3">Available Service Upgrades</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Want to add an in-room massage or private chef dinner? Upgrade your stay before your check-in date.</p>
              
              <div className="space-y-4">
                {[
                  {
                    id: "in-room-massage",
                    name: "In-Suite Therapeutic Massage",
                    price: 40,
                    desc: "60-minute relaxing session in your bedroom."
                  },
                  {
                    id: "chefs-table",
                    name: "Chef's Table Fusion Dinner",
                    price: 30,
                    desc: "6-course private dinner inside your suite."
                  }
                ].map(excursion => {
                  const alreadyBooked = booking.addons.some(a => a.id === excursion.id);
                  return (
                    <div key={excursion.id} className="p-4 border border-border/40 bg-background/25 rounded-2xl flex items-center justify-between gap-4 text-xs">
                      <div>
                        <h4 className="font-medium text-foreground">{excursion.name}</h4>
                        <p className="text-muted-foreground mt-0.5">{excursion.desc}</p>
                        <p className="text-fern font-medium mt-1 font-mono">${excursion.price}</p>
                      </div>
                      
                      {alreadyBooked ? (
                        <span className="text-[10px] uppercase tracking-widest text-fern bg-fern/10 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Booked
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            // Quick simulation adding to booking
                            const updatedBooking = { ...booking };
                            updatedBooking.addons.push({
                              id: excursion.id,
                              name: excursion.name,
                              price: excursion.price,
                              unit: excursion.id === "in-room-massage" ? "per person" : "flat rate",
                            });
                            updatedBooking.financials.subtotal += excursion.price;
                            updatedBooking.financials.tax = 0;
                            updatedBooking.financials.total = updatedBooking.financials.subtotal;
                            
                            setBooking(updatedBooking);
                            localStorage.setItem("pretty_village_active_booking", JSON.stringify(updatedBooking));
                            alert(`${excursion.name} successfully added to your reservation!`);
                          }}
                          className="bg-forest text-mist px-4 py-2 rounded-xl hover:bg-fern hover:text-forest transition uppercase tracking-widest text-[9px] font-semibold flex-shrink-0 ios-springy-btn"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
