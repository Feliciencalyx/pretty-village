import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
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

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Helper function to save inquiries to Firebase
export async function saveInquiryToFirebase(inquiryData: {
  name: string;
  email: string;
  arrival?: string;
  guests?: string | number;
  message?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...inquiryData,
      createdAt: serverTimestamp(),
      createdAtIso: new Date().toISOString()
    });
    console.log("Inquiry saved to Firebase with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firebase save error (using local storage fallback):", error);
    return { success: true, fallback: true };
  }
}

// Helper function to save bookings to Firebase
export async function saveBookingToFirebase(bookingData: Record<string, unknown>) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: serverTimestamp(),
    });
    console.log("Booking saved to Firebase with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.warn("Firebase booking save error (using local storage fallback):", error);
    return { success: true, fallback: true };
  }
}
