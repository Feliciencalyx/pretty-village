import { useState } from "react";

export function WhatsAppButton() {
  const [showWaModal, setShowWaModal] = useState(false);
  const [waGuestName, setWaGuestName] = useState("");

  const handleStartWaChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = waGuestName.trim() || "Guest";
    const text = encodeURIComponent(
      `*🌐 WEBSITE DIRECT ENQUIRY - Pretty Village Musanze* 🏡✨\n----------------------------------------\n*Guest Name:* ${finalName}\n*Source:* Official Website\nHello! My name is ${finalName}. I am contacting you directly from your Official Website.\nI would like to enquire about suite availability and rates for my upcoming stay in Musanze.`
    );
    window.open(`https://wa.me/250792500176?text=${text}`, "_blank", "noopener,noreferrer");
    setShowWaModal(false);
  };

  return (
    <>
      {/* Permanently Fixed Floating WhatsApp Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <button
          onClick={() => setShowWaModal(true)}
          className="flex items-center gap-2.5 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-[#20ba59] hover:scale-105 transition-all duration-300 ios-springy-btn active:scale-95 border border-white/20"
          aria-label="WhatsApp Us"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.144 4.18 4.246-1.113z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
        </button>
      </div>

      {/* Interactive Name Input Prompt Modal */}
      {showWaModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-background max-w-sm w-full p-8 rounded-3xl border border-border/40 text-left shadow-2xl space-y-6 relative animate-scaleIn">
            <button
              onClick={() => setShowWaModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm p-2"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold">
                💬
              </div>
              <div>
                <h3 className="font-semibold text-base text-foreground">Connect on WhatsApp</h3>
                <p className="text-xs text-muted-foreground">Pretty Village Musanze Host</p>
              </div>
            </div>

            <form onSubmit={handleStartWaChat} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                  Enter Your Name:
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Jean Baptiste"
                  value={waGuestName}
                  onChange={(e) => setWaGuestName(e.target.value)}
                  className="w-full p-4 bg-muted/40 border border-border/40 rounded-2xl text-sm text-foreground focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-2xl hover:bg-[#20ba59] transition shadow-md flex items-center justify-center gap-2 ios-springy-btn"
                >
                  Start Chat <span className="text-base">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
