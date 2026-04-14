"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Church,
  Users,
  Home,
  Handshake,
  Wallet,
  Calendar,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Churches", href: "#", icon: Church },
  { label: "Members", href: "#", icon: Users },
  { label: "Cells", href: "#", icon: Home },            // célula = casa
  { label: "Volunteers", href: "#", icon: Handshake },
  { label: "Finance", href: "#", icon: Wallet },
  { label: "Events", href: "#", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        backgroundColor: "#0F172A",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Name */}
      <div
        style={{
          height: 64,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          color: "#E5E7EB",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        System Name
      </div>

      {/* Menu */}
      <nav
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: isActive ? "#C7D2FE" : "#9CA3AF",
                background: isActive
                  ? "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(124,58,237,0.18))"
                  : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              <Icon
                size={18}
                color={isActive ? "#A5B4FC" : "#6B7280"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
