"use client";
import { useState, useEffect } from "react";
import saveDataToFirebase, { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const AttendesFunstion = ({ user }) => {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isArrival, setIsArrival] = useState(null);
  const [loading, setLoading] = useState(false);

  const addfirebase = async () => {
    try {
      await setDoc(doc(db, "attendess", user.id), {
        sign_in_time: serverTimestamp(),
        user: user.family_name + " " + user.given_name,
        email: user.email,
      });
      alert("ma'lumotlar yuklandi");
    } catch (error) {
      alert("xatolik - AttendesFunstion line 15");
    }
  };

  // Geolocationni aniqlash funksiyasi
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          setMessage("Geolokatsiya topilmadi.");
          setLoading(false);
        }
      );
    } else {
      setMessage("Geolokatsiya brauzeringizda qo'llab-quvvatlanmaydi.");
    }
  };

  // Geolokatsiyalar orasidagi masofani hisoblash (metrda)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Yer radiusi (metrda)
    const toRad = (value) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Masofa metrda
  };
  const checkLocation = async (userLat, userLon) => {
    // Ish joyi koordinatalari (Firebase yoki boshqa bazadan o'qib olish mumkin)
    const officeLat = 43.8041334;
    const officeLon = 59.4457988;

    // Masofani hisoblash
    const distance = calculateDistance(userLat, userLon, officeLat, officeLon);

    // 10 metr radiusni tekshirish
    if (distance <= 10) {
      console.log("✅ Siz ish joyidasiz!");
    } else {
      console.log("❌ Siz ish joyida emassiz!");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          checkLocation(userLat, userLon);
        },
        (error) => {
          console.error("Geolokatsiya xatosi:", error.message);
        }
      );
    } else {
      console.error("Geolokatsiya funksiyasi mavjud emas!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-[50vw]">
      <h1 className="text-3xl font-bold mb-4">Xodimlar Tizimi</h1>
      <h1>40.930202</h1>
      <h1>71.8937198</h1>
      {user ? (
        <>{user.family_name + " " + user.given_name}</>
      ) : (
        <>user topilmadi</>
      )}
      <div className="mb-4">
        <button
          onClick={() => {
            setIsArrival(true);
            getLocation();
          }}
          className="bg-green-500 text-white p-4 rounded-lg m-2"
        >
          Men Keldim
        </button>
        <button
          onClick={() => {
            setIsArrival(false);
            getLocation();
          }}
          className="bg-red-500 text-white p-4 rounded-lg m-2"
        >
          Men Ketdim
        </button>
        <button
          onClick={() => {
            getUserLocation();
          }}
          className="bg-blue-500 text-white p-4 rounded-lg m-2"
        >
          Joylashuvni aniqlash
        </button>
      </div>
      {loading && (
        <p className="text-xl text-blue-500">Lokatsiyani aniqlayapman...</p>
      )}
      <p className="text-xl text-gray-700">{status}</p>
      <p className="text-xl text-red-500">{message}</p>
    </div>
  );
};

export default AttendesFunstion;
