"use client";
import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Printer, Table2, FileDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyAttendess = ({ currentUser }) => {
  const [attendess, setAttendess] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  const tableRef = useRef();

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600); // Soatlar
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Qolgan daqiqalar
    const seconds = totalSeconds % 60; // Qolgan sekundlar

    return `${hours}:${minutes}:${seconds}`;
  };

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
        where("userId", "==", currentUser.kindeId || currentUser.id),
        where("month", "==", month)
      );
      const attendessDocs = await getDocs(q);
      const attendessData = attendessDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sanaga qarab tartiblash
      attendessData.sort((a, b) => new Date(a.date) - new Date(b.date));

      setAttendess(attendessData);

      // Umumiy ishlagan soatni hisoblash
      const total = attendessData.reduce((sum, record) => {
        return sum + (parseFloat(record.ishlagan_soati) || 0);
      }, 0);
      setTotalHours(total);
    } catch (err) {
      setError("Ma'lumotlarni olishda xato yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e, 10);
    setSelectedMonth(newMonth);
    fetchMyAttendess(newMonth);
  };

  useEffect(() => {
    fetchMyAttendess(selectedMonth);
  }, [selectedMonth]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Mening Hisobotlarim", 14, 10);
    doc.autoTable({
      head: [["Sana", "Kelgan Vaqti", "Ketgan Vaqti", "Ishlagan Soati"]],
      body: attendess.map((record) => [
        record.date || "-",
        record.arrivel_time || "-",
        record.gone_time || "-",
        record.ishlagan_soati || "-",
      ]),
    });
    doc.text(
      `Umumiy ishlagan soat: ${formatTime(totalHours)} soat`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.save("Mening-Hisobotlarim.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendess.map((record) => ({
        Sana: record.date || "-",
        "Kelgan Vaqti": record.arrivel_time || "-",
        "Ketgan Vaqti": record.gone_time || "-",
        "Ishlagan Soati": record.ishlagan_soati || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hisobotlar");
    XLSX.writeFile(workbook, "Mening-Hisobotlarim.xlsx");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mening Hisobotlarim</h1>
      <div className="mb-4 flex gap-2">
        <div>
          <Select
            id="month"
            defaultValue={selectedMonth}
            value={selectedMonth}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index + 1}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={exportToExcel}>
          <Table2 />
        </Button>
        <Button onClick={exportToPDF}>
          <FileDown />
        </Button>
        <Button onClick={handlePrint}>
          <Printer />
        </Button>
      </div>
      <div className="mb-4">
        <p className="flex gap-2 items-center">
          <strong className="flex gap-2 items-center">
            Umumiy ishlagan vaqt:
          </strong>
          {loading ? "Hisoblanmoqda..." : `${formatTime(totalHours)}`}
        </p>
      </div>

      {loading ? (
        <div className="text-center">Yuklanmoqda...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : attendess.length > 0 ? (
        <div
          className="overflow-x-auto rounded-lg overflow-hidden"
          id="table-content"
        >
          <Table ref={tableRef}>
            <TableHeader>
              <TableRow>
                <TableCell className="bg-gray-400">
                  <strong>Sana</strong>
                </TableCell>
                <TableCell className="bg-gray-400">
                  <strong>Kelgan Vaqti</strong>
                </TableCell>
                <TableCell className="bg-gray-400">
                  <strong>Ketgan Vaqti</strong>
                </TableCell>
                <TableCell className="bg-gray-400">
                  <strong>Ishlagan Soati</strong>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendess.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date || "-"}</TableCell>
                  <TableCell>{record.arrivel_time || "-"}</TableCell>
                  <TableCell>{record.gone_time || "-"}</TableCell>
                  <TableCell>
                    {formatTime(record.ishlagan_soati) || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-gray-500">Ma'lumotlar topilmadi.</div>
      )}
    </div>
  );
};

export default MyAttendess;
