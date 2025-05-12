"use client";
import Link from "next/link";

export default function FarmerSidebar() {
  return (
    <nav className="w-64 bg-white shadow-lg p-4">
      <ul className="space-y-4">
        <li><Link href="/farmer">Dashboard</Link></li>
        <li><Link href="/farmer/animals">Animals</Link></li>
        <li><Link href="/farmer/consultations">Consultations</Link></li>
        <li><Link href="/farmer/tracking">Tracking</Link></li>
        <li><Link href="/farmer/messages">Messages</Link></li>
      </ul>
    </nav>
  );
} 