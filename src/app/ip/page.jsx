"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import allowedIps from "../allowedIps"; // Tasdiqlangan IP ro'yxati

export default function IpPage() {
  const [userIp, setUserIp] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    async function fetchIp() {
      try {
        // IP manzilni olish uchun tashqi API chaqiruvi
        const response = await axios.get("https://api64.ipify.org?format=json");
        const currentIp = response.data.ip;

        setUserIp(currentIp);

        // IP mosligini tekshirish
        if (allowedIps.includes(currentIp)) {
          setAccessGranted(true); // Kirish ruxsati berildi
        } else {
          setAccessGranted(false); // Ruxsat yo'q
        }
      } catch (error) {
        console.error("IP olishda xatolik:", error);
        setUserIp("Aniqlab bo'lmadi");
      }
    }

    fetchIp();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {accessGranted ? (
        <div>
          <h1>Salom, foydalanuvchi!</h1>
          <p>
            Sizning IP-manzilingiz: <strong>{userIp}</strong>
          </p>
          <p>Bu sahifaga kirishingizga ruxsat berilgan!</p>
        </div>
      ) : (
        <div>
          <h1>Ruxsat yo'q</h1>
          <p>
            Sizning IP-manzilingiz: <strong>{userIp}</strong>
          </p>
          <p>Sizda ushbu sahifaga kirish huquqi yo'q.</p>
        </div>
      )}
    </div>
  );
}
