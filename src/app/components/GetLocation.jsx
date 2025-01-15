"use client";
import { useState } from "react";

const GetLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Geolokatsiyani olish funksiyasi
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude }); // Latitude va Longitude ni statega saqlash
          setErrorMessage(""); // Xato xabarini tozalash
        },
        (error) => {
          setErrorMessage("Geolokatsiya aniqlanmagan. Iltimos, GPS ni yoqing.");
        }
      );
    } else {
      setErrorMessage("Geolokatsiya brauzeringizda qo'llab-quvvatlanmaydi.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] bg-gray-100 w-[50vw]">
      <h1 className="text-3xl font-bold mb-4">Geolokatsiya Tizimi</h1>
      <div className="mb-4">
        <button
          onClick={getLocation}
          className="bg-blue-500 text-white p-4 rounded-lg"
        >
          Hozirgi joylashuvni korish
        </button>
      </div>

      {location && (
        <div className="text-xl text-green-500">
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      {errorMessage && <p className="text-xl text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default GetLocation;
