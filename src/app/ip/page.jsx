"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [userIp, setUserIp] = useState("Aniqlanmoqda...");

  useEffect(() => {
    async function fetchIp() {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setUserIp(response.data.ip);
      } catch (error) {
        setUserIp("IP manzilni olishda xatolik yuz berdi.");
        console.error("IP olishda muammo:", error);
      }
    }

    fetchIp();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Salom, foydalanuvchi!</h1>
      <p>Sizning IP-manzilingiz:</p>
      <h2 style={{ color: "blue" }}>{userIp}</h2>
    </div>
  );
}
