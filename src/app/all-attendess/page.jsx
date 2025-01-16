"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const AllAttendess = () => {
  const [users, setUsers] = useState([]);
  const [attendess, setAttendess] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const userDocs = await getDocs(usersRef);
      const usersData = userDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (err) {
      setError("Foydalanuvchilarni olishda xato yuz berdi.");
    }
  };

  const fetchAttendess = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const attendessRef = collection(db, "attendess");
      const q = query(attendessRef, where("date", "==", date));
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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendess(newDate);
  };

  useEffect(() => {
    fetchUsers();
    fetchAttendess(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hamma Xodimlar</h1>
      <div className="mb-4">
        <label htmlFor="date" className="block font-medium mb-2">
          Sana tanlang:
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded-md p-2"
        />
      </div>

      {loading ? (
        <div className="text-center">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Ism</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Kelgan Vaqti</th>
                <th className="border px-4 py-2">Ketgan Vaqti</th>
                <th className="border px-4 py-2">Ishlagan Soati</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userAttendess = attendess.find(
                  (a) => a.userId === user.id
                );
                return (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.surname} {user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      {userAttendess?.arrivel_time || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {userAttendess?.gone_time || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {userAttendess?.ishlagan_soati || "-"}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500"
                  >
                    Ma'lumotlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllAttendess;
