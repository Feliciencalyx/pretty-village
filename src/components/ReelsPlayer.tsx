import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX, MapPin, Play, Pause, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  user: string;
  text: string;
  time: string;
}

interface Reel {
  id: number;
  src: string;
  caption: string;
  likes: number;
  comments: number;
  music: string;
  location: string;
  commentsList: Comment[];
}

const REELS_DATA: Reel[] = [
  {
    id: 1,
    src: "/videos/reel-1.mp4",
    caption: "Walking among the giants 🌲 Cypress pathways in Musanze.",
    likes: 12430,
    comments: 5120,
    music: "Visit Rwanda - Ambient Beats",
    location: "Pretty Village Gardens",
    commentsList: [
      { user: "@kevin_rwa", text: "Musanze is stunning, these trees are massive! 🌲", time: "2h ago" },
      { user: "@nature_lover", text: "So quiet and relaxing. The perfect getaway.", time: "1d ago" }
    ]
  },
  {
    id: 2,
    src: "/videos/reel-2.mp4",
    caption: "Morning views that feel like a dream 🌤️✨ Discovering Musanze.",
    likes: 10850,
    comments: 5430,
    music: "Calm Acoustic Guitar",
    location: "Twin Lakes Viewpoint",
    commentsList: [
      { user: "@alicia_g", text: "Those twin lakes are a masterpiece. Beautiful capture! 😍", time: "4h ago" },
      { user: "@eric_nk", text: "I hiked there last month, definitely worth it.", time: "3d ago" }
    ]
  },
  {
    id: 3,
    src: "/videos/reel-3.mp4",
    caption: "Lush tropical walks around our beautiful compound 🌴🚶‍♂️",
    likes: 14500,
    comments: 5820,
    music: "African Folk Beats",
    location: "Pretty Village",
    commentsList: [
      { user: "@rwandan_foodie", text: "Look at that green grass! Love the garden details.", time: "10h ago" },
      { user: "@holiday_guide", text: "Is it close to the main town?", time: "5d ago" }
    ]
  },
  {
    id: 4,
    src: "/videos/reel-4.mp4",
    caption: "A soothing afternoon by our cascading waterfall pool 💦🏊‍♀️",
    likes: 15300,
    comments: 6120,
    music: "Soft Piano & Nature Sounds",
    location: "Resort Pool",
    commentsList: [
      { user: "@poolside_vibes", text: "Waterfall pool in the mountains? Yes please! 🌊", time: "1d ago" },
      { user: "@travel_tips", text: "This water looks so clean and refreshing.", time: "2d ago" }
    ]
  },
  {
    id: 5,
    src: "/videos/reel-5.mp4",
    caption: "Deep inside the historic Musanze Caves ⛰️🦇 Exploration time!",
    likes: 31050,
    comments: 9840,
    music: "Adventure Cinematic Theme",
    location: "Musanze Caves",
    commentsList: [
      { user: "@explore_caves", text: "Entering the caves is like entering a new world! 🦇", time: "3h ago" },
      { user: "@adv_seeker", text: "Did you see any bats inside? Creepy but cool.", time: "2d ago" }
    ]
  },
  {
    id: 6,
    src: "/videos/reel-6.mp4",
    caption: "Relaxing vibes in our modern lobby lounge area. Welcome home ☕🛋️",
    likes: 11812,
    comments: 5190,
    music: "Lofi Chill Vibes",
    location: "Boutique Lobby",
    commentsList: [
      { user: "@cozy_stays", text: "That lounge looks so cozy with those African art pieces.", time: "1h ago" },
      { user: "@mimi_t", text: "Very authentic and welcoming design.", time: "1d ago" }
    ]
  },
  {
    id: 7,
    src: "/videos/reel-7.mp4",
    caption: "Gourmet dining served fresh at Pretty Village 🍽️🔥",
    likes: 17200,
    comments: 7240,
    music: "Acoustic Sunset Beats",
    location: "Pretty Village Kitchen",
    commentsList: [
      { user: "@chef_dining", text: "The food looks absolutely delicious. Rwandan spices are unmatched! 🍛", time: "30m ago" },
      { user: "@hungry_traveler", text: "Private chef makes all the difference.", time: "12h ago" }
    ]
  },
  {
    id: 8,
    src: "/videos/reel-8.mp4",
    caption: "Tropical paradise path - feeling the fresh Musanze breeze 🍃🌸",
    likes: 11250,
    comments: 5300,
    music: "Summer Chill Out",
    location: "Palm Garden Path",
    commentsList: [
      { user: "@palm_lover", text: "Beautiful palm paths. Walking there in the morning must be great.", time: "5h ago" },
      { user: "@sunny_days", text: "Incredible tropical landscape design.", time: "4d ago" }
    ]
  },
  {
    id: 9,
    src: "/videos/reel-9.mp4",
    caption: "Our luxury suite details with ambient smart LED lights 💡✨",
    likes: 28400,
    comments: 8920,
    music: "Chill Jazzhop",
    location: "Deluxe Suite",
    commentsList: [
      { user: "@led_smart", text: "Those blue LED lights are fire. Modern touch to the suite! ⚡", time: "8h ago" },
      { user: "@design_inspo", text: "Perfect bedroom lighting config.", time: "2d ago" }
    ]
  },
  {
    id: 10,
    src: "/videos/reel-10.mp4",
    caption: "Enjoying local Rwandan single-origin coffee on the terrace ☕",
    likes: 10940,
    comments: 5050,
    music: "Coffee Shop Morning",
    location: "Pretty Village Terrace",
    commentsList: [
      { user: "@coffee_geek", text: "Rwandan single-origin coffee is the best in the world. Hands down! ☕🇷🇼", time: "12m ago" },
      { user: "@morning_routine", text: "Coffee with that green view is absolutely unmatched.", time: "1h ago" }
    ]
  }
];

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export function ReelsPlayer() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reels, setReels] = useState<Reel[]>(REELS_DATA);
  const [newCommentText, setNewCommentText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Desktop Player refs
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const [isDesktopPlaying, setIsDesktopPlaying] = useState(false);

  // Sync isDesktop state on mount and update on window resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(min-width: 768px)");
      setIsDesktop(media.matches);
      const listener = (e: MediaQueryListEvent) => {
        setIsDesktop(e.matches);
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // IntersectionObserver to auto-mute/pause when scrolling away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsMuted(true);
          setIsPlayerVisible(false);
        } else {
          setIsPlayerVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, []);

  // Handle scroll detection to determine active video on mobile
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const itemHeight = container.clientHeight;
    const index = Math.round(scrollPosition / itemHeight);
    if (index !== activeReelIndex && index >= 0 && index < reels.length) {
      setActiveReelIndex(index);
    }
  };

  // Sync desktop video playback when active index changes or visibility changes
  useEffect(() => {
    if (!desktopVideoRef.current) return;
    
    try {
      desktopVideoRef.current.volume = 0.2;
    } catch {
      // ignore
    }
    
    if (isPlayerVisible && isDesktop) {
      const playPromise = desktopVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsDesktopPlaying(true))
          .catch(() => setIsDesktopPlaying(false));
      }
    } else {
      desktopVideoRef.current.pause();
      setIsDesktopPlaying(false);
    }
  }, [activeReelIndex, isPlayerVisible, isDesktop]);

  const toggleDesktopPlay = () => {
    if (!desktopVideoRef.current) return;
    if (isDesktopPlaying) {
      desktopVideoRef.current.pause();
      setIsDesktopPlaying(false);
    } else {
      desktopVideoRef.current.play();
      setIsDesktopPlaying(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      user: "@you",
      text: newCommentText.trim(),
      time: "Just now"
    };

    setReels(prevReels => {
      const updated = [...prevReels];
      updated[activeReelIndex] = {
        ...updated[activeReelIndex],
        commentsList: [newComment, ...updated[activeReelIndex].commentsList],
        comments: updated[activeReelIndex].comments + 1
      };
      return updated;
    });

    setNewCommentText("");
  };

  const handleLikeReel = (index: number) => {
    setReels(prevReels => {
      const updated = [...prevReels];
      const reel = updated[index];
      // Simple toggle
      const isAlreadyLiked = reel.likes > REELS_DATA[index].likes;
      updated[index] = {
        ...reel,
        likes: isAlreadyLiked ? reel.likes - 1 : reel.likes + 1
      };
      return updated;
    });
  };

  const currentReel = reels[activeReelIndex];

  return (
    <div ref={wrapperRef} className="mt-12 flex flex-col items-center justify-center animate-fadeIn">
      {/* Title / Helper info */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-fern font-semibold">Musanze TV</p>
        <h3 className="text-2xl font-light mt-1 text-foreground">Explore local vibes</h3>
        <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
          Explore the beauty of Musanze and Pretty Village through local reels.
        </p>
      </div>

      {isDesktop ? (
        /* 1. WEBSITE VIEW (Desktop - Large split dashboard) */
        <div className="grid grid-cols-[400px_1fr] gap-8 bg-card border border-border/40 p-6 rounded-3xl shadow-md w-full max-w-[950px] h-[650px] overflow-hidden">
          
          {/* Left column: Large high-end video player */}
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg flex items-center justify-center h-full group border border-white/5">
            <video
              ref={desktopVideoRef}
              src={currentReel.src}
              loop
              playsInline
              muted={isMuted}
              onClick={toggleDesktopPlay}
              className="w-full h-full object-cover cursor-pointer"
              preload="metadata"
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* Sound Toggle (Top Right) */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition ios-springy-btn"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Play/Pause center overlay (on hover/click) */}
            <button
              onClick={toggleDesktopPlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/40 text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
            >
              {isDesktopPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
              )}
            </button>

            {/* Bottom Details Overlay on Video */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10 pointer-events-none">
              <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 mb-1.5">
                <MapPin className="w-3 h-3 text-fern fill-fern/20" />
                <span>{currentReel.location}</span>
              </div>
              <h4 className="font-semibold text-xs">@pretty_village</h4>
              
              <div className="flex items-center gap-1.5 mt-2 text-fern text-[9px] font-semibold tracking-wider">
                <Music className="w-3 h-3 flex-shrink-0 animate-pulse" />
                <div className="overflow-hidden w-28 relative h-3.5">
                  <span className="inline-block whitespace-nowrap animate-marquee">
                    {currentReel.music}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Social Details, Comments Feed & Playlist Exploration */}
          <div className="flex flex-col h-full justify-between overflow-hidden">
            
            {/* Top section: Active video details */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex justify-between items-start border-b border-border/40 pb-3">
                <div>
                  <h4 className="font-semibold text-base flex items-center gap-2">
                    Pretty Village Musanze
                    <span className="text-xs font-light text-muted-foreground">@pretty_village</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-fern" /> {currentReel.location}
                    </span>
                  </div>
                </div>

                {/* Likes/Comments counters */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLikeReel(activeReelIndex)}
                    className={`flex items-center gap-1.5 text-xs border border-border/40 px-3 py-1.5 rounded-full transition ios-springy-btn hover:bg-muted/10 ${
                      currentReel.likes > REELS_DATA[activeReelIndex].likes ? "text-rose-500 border-rose-500/20 bg-rose-50/5" : ""
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{formatNumber(currentReel.likes)}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/40 px-3 py-1.5 rounded-full">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{formatNumber(currentReel.comments)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-light mt-3 text-foreground/80 leading-relaxed">
                {currentReel.caption}
              </p>

              {/* Interactive Comments List */}
              <div className="flex-1 mt-4 overflow-y-auto no-scrollbar border border-border/30 rounded-2xl bg-muted/15 p-4 flex flex-col gap-3 min-h-[140px] max-h-[170px]">
                {currentReel.commentsList.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center my-auto">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  currentReel.commentsList.map((c, i) => (
                    <div key={i} className="text-xs flex flex-col bg-card/65 border border-border/10 p-2.5 rounded-xl">
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-fern">{c.user}</span>
                        <span className="text-[10px] text-muted-foreground font-light">{c.time}</span>
                      </div>
                      <p className="text-foreground/90 font-light mt-1">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment input form */}
              <form onSubmit={handleAddComment} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Add a mock comment..."
                  className="flex-1 px-4 py-2.5 bg-muted/40 border-0 rounded-2xl text-xs focus:outline-none focus:bg-background focus:ring-2 focus:ring-fern/30 transition-all"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-forest text-mist rounded-xl hover:bg-fern hover:text-forest transition ios-springy-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Bottom section: Playlists thumbnail explore cards */}
            <div className="border-t border-border/40 pt-4 mt-4">
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2.5">More Musanze Reels</h4>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
                {reels.map((reel, index) => {
                  const isActive = index === activeReelIndex;
                  return (
                    <div
                      key={reel.id}
                      onClick={() => setActiveReelIndex(index)}
                      className={`relative w-20 h-28 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all ios-springy-btn ${
                        isActive ? "border-fern shadow-md scale-105" : "border-border/40 hover:border-fern/60"
                      }`}
                    >
                      <img
                        src="/images/exterior-night.jpg"
                        alt={`Reel ${reel.id}`}
                        className="w-full h-full object-cover pointer-events-none opacity-80"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <Play className={`w-3.5 h-3.5 text-white ${isActive ? "fill-white" : "opacity-80"}`} />
                      </div>
                      <span className="absolute bottom-1 left-1 right-1 text-[8px] truncate bg-black/60 text-white px-1 py-0.5 rounded text-center">
                        Reel {reel.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* 2. PHONE VIEW (Mobile - Vertical iOS snap swiper mockup) */
        <div className="relative flex items-center justify-center w-full max-w-[400px]">
          {/* iOS Phone Mockup Container */}
          <div className="relative w-[340px] h-[600px] rounded-[44px] border-[8px] border-forest bg-black shadow-2xl overflow-hidden flex flex-col">
            
            {/* Speaker / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-forest rounded-b-xl z-30 flex items-center justify-center">
              <span className="block w-8 h-0.5 bg-white/20 rounded-full" />
            </div>

            {/* Reels Snap Scroll Feed */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {reels.map((reel, index) => (
                <ReelItem
                  key={reel.id}
                  reel={reel}
                  isActive={index === activeReelIndex}
                  isMuted={isMuted}
                  isPlayerVisible={isPlayerVisible}
                  onMuteToggle={() => setIsMuted(!isMuted)}
                  onLikeToggle={() => handleLikeReel(index)}
                  likesCount={reel.likes}
                  commentsCount={reel.comments}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReelItemProps {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  isPlayerVisible: boolean;
  onMuteToggle: () => void;
  onLikeToggle: () => void;
  likesCount: number;
  commentsCount: number;
}

function ReelItem({ reel, isActive, isMuted, isPlayerVisible, onMuteToggle, onLikeToggle, likesCount, commentsCount }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

  // Auto-play/pause based on active state and visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    try {
      videoRef.current.volume = 0.2;
    } catch {
      // ignore
    }
    
    if (isActive && isPlayerVisible) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Auto-play blocked by browser. Awaiting user interaction.", err);
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlayerVisible]);

  const handleVideoTap = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
    
    setShowPlayOverlay(true);
    setTimeout(() => setShowPlayOverlay(false), 500);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin + reel.src).catch(() => {});
      }
    } catch {
      // ignore clipboard error on mobile
    }
  };

  return (
    <div className="w-full h-full snap-start snap-always relative overflow-hidden flex flex-col justify-end bg-black">
      {/* Background HTML5 Video - Only rendered when active to protect mobile GPU memory */}
      {isActive ? (
        <video
          ref={videoRef}
          src={reel.src}
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoTap}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          preload="metadata"
        />
      ) : (
        <div 
          onClick={handleVideoTap}
          className="absolute inset-0 w-full h-full bg-cover bg-center cursor-pointer opacity-80"
          style={{ backgroundImage: "url('/images/exterior-night.jpg')" }}
        />
      )}

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75 pointer-events-none" />

      {/* Floating Play/Pause Action Flash Overlay */}
      <AnimatePresence>
        {showPlayOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/40 flex items-center justify-center pointer-events-none"
          >
            {isPlaying ? (
              <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
            ) : (
              <Pause className="w-8 h-8 text-white fill-white" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Social Actions Menu */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
        {/* Mute Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMuteToggle();
          }}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLikeClick}
            className={`w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center transition active:scale-90 ${
              isLiked ? "text-rose-500" : "text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
          <span className="text-[10px] text-white mt-1.5 font-medium drop-shadow-md">
            {formatNumber(likesCount)}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition">
            <MessageCircle className="w-5 h-5" />
          </button>
          <span className="text-[10px] text-white mt-1.5 font-medium drop-shadow-md">
            {formatNumber(commentsCount)}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Rotating Music Disc */}
        <div className="relative mt-2 flex items-center justify-center">
          <div
            className={`w-9 h-9 rounded-full bg-black/80 border-[3px] border-white/20 overflow-hidden flex items-center justify-center ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "5s" }}
          >
            <div className="w-4 h-4 rounded-full bg-fern flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Details (Info Overlay) */}
      <div className="absolute left-4 right-16 bottom-6 text-white z-10 select-none">
        {/* Location Badge */}
        <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 mb-2">
          <MapPin className="w-3 h-3 text-fern fill-fern/20" />
          <span>{reel.location}</span>
        </div>

        {/* Handle */}
        <h4 className="font-semibold text-sm">@pretty_village</h4>

        {/* Description */}
        <p className="text-xs text-white/90 font-light mt-1.5 leading-relaxed line-clamp-2">
          {reel.caption}
        </p>

        {/* Music Scrolling Marquee */}
        <div className="flex items-center gap-1.5 mt-3 text-fern text-[10px] font-semibold tracking-wider">
          <Music className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
          <div className="overflow-hidden w-full relative h-4">
            <span className="inline-block whitespace-nowrap animate-marquee">
              {reel.music}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
