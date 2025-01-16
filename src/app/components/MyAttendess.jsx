"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const MyAttendess = ({ currentUser }) => {
  const [attendess, setAttendess] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default joriy oy
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  const fetchMyAttendess = async (month) => {
    setLoading(true);
    setError(null);
    try {
      const attendessRef = collection(db, "attendess");
      const q = query(
        attendessRef,
        where("userId", "==", currentUser.id),
        where("month", "==", month) // Baza ma'lumotlarida oy formatida saqlanishi kerak
      );
      const attendessDocs = await getDocs(q);
      const attendessData = attendessDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendess(attendessData);
    } catch (err) {
      setError("Ma'lumotlarni olishda xato yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setSelectedMonth(newMonth);
    fetchMyAttendess(newMonth);
  };

  useEffect(() => {
    fetchMyAttendess(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mening Hisobotlarim</h1>
      <div className="mb-4">
        <label htmlFor="month" className="block font-medium mb-2">
          Oyni tanlang:
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border rounded-md p-2"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : attendess.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Sana</th>
                <th className="border px-4 py-2">Kelgan Vaqti</th>
                <th className="border px-4 py-2">Ketgan Vaqti</th>
                <th className="border px-4 py-2">Ishlagan Soati</th>
              </tr>
            </thead>
            <tbody>
              {attendess.map((record) => (
                <tr key={record.id}>
                  <td className="border px-4 py-2">{record.date || "-"}</td>
                  <td className="border px-4 py-2">
                    {record.arrivel_time || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {record.gone_time || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {record.ishlagan_soati || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">Ma'lumotlar topilmadi.</div>
      )}
    </div>
  );
};

export default MyAttendess;
