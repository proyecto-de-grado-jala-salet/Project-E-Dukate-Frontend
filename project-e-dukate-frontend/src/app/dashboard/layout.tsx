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

    const pathSegments = pathname.split("/");
    const currentTab = pathSegments.length > 2 ? pathSegments[2] : "dashboard";

    const allowedTabs =
      userRole === "Administrator"
        ? [
            "especialidades",
            "usuarios",
            "pacientes",
            "pagos",
            "horarios",
            "metricas",
          ]
        : ["pagos"];

    const defaultTab = userRole === "Administrator" ? "especialidades" : "pagos";

    if (currentTab === "dashboard" || !allowedTabs.includes(currentTab)) {
      router.push(`/dashboard/${defaultTab}`);
    }
  }, [token, userRole, pathname, router]);

  const getSelectedTab = () => {
    if (!pathname) return userRole === "Administrator" ? "especialidades" : "pagos";
    const path = pathname.split("/").pop();
    return path || (userRole === "Administrator" ? "especialidades" : "pagos");
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