"use client";
import { useState, useEffect } from "react";
import saveDataToFirebase from "../firebase";
import GetUserFS from "./GetUserFS";

const AttendesFunstion = async () => {
  const user = await GetUserFS();

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isArrival, setIsArrival] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (location && isArrival !== null) {
      const predefinedLocation = {
        latitude: 43.8041334,
        longitude: 59.4457988,
      };
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        predefinedLocation.latitude,
        predefinedLocation.longitude
      );

      if (distance <= 0.01) {
        setStatus(isArrival ? "Siz keldingiz." : "Siz ketdingiz.");
        alert("aaaaaaaa");
      } else {
        setMessage("Siz ish joyidan uzoqda turibsiz.");
        setStatus("");
      }
    }
  }, [location, isArrival]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Yerning radiusi, metrda
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Masofa metrda
    return distance;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-[50vw]">
      <h1 className="text-3xl font-bold mb-4">Xodimlar Tizimi</h1>
      <h1>40.930202</h1>
      <h1>71.8937198</h1>
      {user ? <>{userfamily_name}</> : <>user topilmadi</>}
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
