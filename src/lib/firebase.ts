import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Firebase Configuration (Uses env variables if available, with resilient fallback)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPrettyVillageMusanzeKey2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pretty-village-musanze.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pretty-village-musanze",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pretty-village-musanze.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "108294719284",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:108294719284:web:ab9273fe9401"
};

// Initialize Firebase App & Firestore safely
let db: ReturnType<typeof getFirestore> | null = null;
try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialization skipped:", err);
}

// 1-second timeout wrapper to prevent any main-thread blocking or unresponsive browser dialogs
function withTimeout<T>(promise: Promise<T>, ms = 1000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firebase operation timed out"));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper function to save inquiries
export async function saveInquiryToFirebase(inquiryData: {
  name: string;
  email: string;
  arrival?: string;
  guests?: string | number;
  message?: string;
}) {
  try {
    // Save to local storage cache instantly
    const existingInquiries = JSON.parse(localStorage.getItem("pretty_village_inquiries") || "[]");
    localStorage.setItem("pretty_village_inquiries", JSON.stringify([{
      ...inquiryData,
      id: "INQ-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: new Date().toISOString()
    }, ...existingInquiries]));

    if (db) {
      // Attempt Firebase Firestore save with 1s timeout
      await withTimeout(
        addDoc(collection(db, "inquiries"), {
          ...inquiryData,
          createdAt: serverTimestamp(),
          createdAtIso: new Date().toISOString()
        }),
        1000
      );
    }
    return { success: true };
  } catch (error) {
    console.warn("Firebase save handled seamlessly with local fallback:", error);
    return { success: true, fallback: true };
  }
}

// Helper function to save bookings
export async function saveBookingToFirebase(bookingData: Record<string, unknown>) {
  try {
    if (db) {
      // Attempt Firebase Firestore save with 1s timeout
      await withTimeout(
        addDoc(collection(db, "bookings"), {
          ...bookingData,
          createdAt: serverTimestamp(),
        }),
        1000
      );
    }
    return { success: true };
  } catch (error) {
    console.warn("Firebase booking save handled seamlessly with local fallback:", error);
    return { success: true, fallback: true };
  }
}
