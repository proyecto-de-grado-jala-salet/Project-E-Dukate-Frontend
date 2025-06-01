"use client";

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    if (!pathname || !userRole) return;

    const pathSegments = pathname.split("/").filter(Boolean);
    const currentTab = pathSegments[1] || "dashboard";
    const allowedTabs =
      userRole === "Administrator"
        ? [
            "especialidades",
            "usuarios",
            "pacientes",
            "pagos",
            "horarios",
            "metricas",
            "faq",
          ]
        : ["pacientes", "pagos", "faq"];

    const defaultTab = userRole === "Administrator" ? "especialidades" : "pacientes";

    if (currentTab === "dashboard" || !allowedTabs.includes(currentTab)) {
      router.push(`/dashboard/${defaultTab}`);
    }
  }, [token, userRole, pathname, router]);

  const getSelectedTab = () => {
    if (!pathname) return userRole === "Administrator" ? "especialidades" : "pacientes";
    const pathSegments = pathname.split("/").filter(Boolean);
    const mainTab = pathSegments[1];
    const validTabs =
      userRole === "Administrator"
        ? ["especialidades", "usuarios", "pacientes", "pagos", "horarios", "metricas", "faq"]
        : ["pacientes", "pagos", "faq"];
    
    return validTabs.includes(mainTab) ? mainTab : (userRole === "Administrator" ? "especialidades" : "pacientes");
  };

  if (!token) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar selectedTab={getSelectedTab()} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flex: 1, bgcolor: "#EDEDED", p: 3, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}