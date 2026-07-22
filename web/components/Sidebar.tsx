"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Handshake,
  LayoutDashboard,
  LogOut,
  Route,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Small Groups", href: "/small-groups", icon: UsersRound },
  { label: "Paths", href: "/paths", icon: Route },
  { label: "Ministries", href: "/ministries", icon: Handshake },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Finance", href: "/finance", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        backgroundColor: "#0F172A",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          minHeight: 72,
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <strong
          style={{
            color: "#E5E7EB",
            fontSize: 18,
          }}
        >
          SaaS Church
        </strong>

        <span
          style={{
            marginTop: 4,
            color: "#94A3B8",
            fontSize: 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.email}
        </span>
      </div>

      <nav
        style={{
          padding: 12,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 4,
        }}
      >
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

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
              <Icon size={18} color={isActive ? "#A5B4FC" : "#6B7280"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 12px",
            border: 0,
            borderRadius: 8,
            background: "transparent",
            color: "#9CA3AF",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <LogOut size={18} color="#6B7280" />
          Logout
        </button>
      </div>
    </aside>
  );
}
