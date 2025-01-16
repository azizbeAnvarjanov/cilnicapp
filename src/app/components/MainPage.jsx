"use client";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import withIpCheck from "../hoc/withIpCheck";
import { db } from "../firebase";

const MainPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [isArriveDisabled, setIsArriveDisabled] = useState(false);
  const [isDepartDisabled, setIsDepartDisabled] = useState(false);

  const handleArrive = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = new Date().toLocaleTimeString(); // HH:MM:SS format
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user.id),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Bugungi kunga kelish vaqti allaqachon yozilgan!");
        setIsArriveDisabled(true);
        return;
      }

      await addDoc(attendessRef, {
        arrivel_time: time,
        gone_time: null,
        user: `${user.family_name} ${user.given_name}`,
        email: user.email,
        date: today,
        userId: user.id,
        ishlagan_soati: null,
      });

      alert("Bazaga kelish vaqti yozildi.");
      setIsArriveDisabled(true);
    } catch (error) {
      alert("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepart = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = new Date().toLocaleTimeString(); // HH:MM:SS format
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user.id),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Bugungi kun uchun kelish vaqti yozilmagan!");
        return;
      }

      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, "attendess", docId);
      const data = querySnapshot.docs[0].data();

      // Kelish vaqti bilan ketish vaqtini hisoblash
      const [arriveHours, arriveMinutes] = data.arrivel_time.split(":").map(Number);
      const [departHours, departMinutes] = time.split(":").map(Number);

      const arriveInMinutes = arriveHours * 60 + arriveMinutes;
      const departInMinutes = departHours * 60 + departMinutes;
      const workedMinutes = departInMinutes - arriveInMinutes;

      const workedHours = Math.floor(workedMinutes / 60);
      const workedMins = workedMinutes % 60;
      const workedTime = `${workedHours} soat ${workedMins} daqiqa`;

      // Yozuvni yangilash
      await updateDoc(docRef, {
        gone_time: time,
        ishlagan_soati: workedTime,
      });

      alert("Bazaga ketish vaqti yozildi va ishlagan soatingiz hisoblandi.");
      setIsDepartDisabled(true);
    } catch (error) {
      alert("Xato yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkButtonState = async () => {
    const today = new Date().toISOString().split("T")[0];
    const attendessRef = collection(db, "attendess");

    try {
      const q = query(
        attendessRef,
        where("userId", "==", user.id),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();

        if (data.arrivel_time) {
          setIsArriveDisabled(true);
        }
        if (data.gone_time) {
          setIsDepartDisabled(true);
        }
      }
    } catch (error) {
      console.error("Tugma holatini tekshirishda xato: ", error);
    }
  };

  useEffect(() => {
    checkButtonState();
  }, [user]);

  return (
    <div className="p-10 flex gap-3">
      <button
        className={`${
          isArriveDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600"
        } p-2 rounded-md text-white`}
        onClick={handleArrive}
        disabled={isArriveDisabled || loading}
      >
        Men keldim
      </button>
      <button
        className={`${
          isDepartDisabled ? "bg-gray-600 cursor-not-allowed" : "bg-red-600"
        } p-2 rounded-md text-white`}
        onClick={handleDepart}
        disabled={isDepartDisabled || loading}
      >
        Men ketdim
      </button>
    </div>
  );
};

export default withIpCheck(MainPage);
