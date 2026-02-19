/**
 * DealGuard Studio Tool Module
 * 
 * AI-powered deal generation and validation for admin use
 */

import { AdminToolModule } from "../types";

export const dealguardTool: AdminToolModule = {
  id: "dealguard",
  name: "DealGuard Studio",
  description: "AI-powered deal generation and validation",
  icon: "mdi-shield-check",
  launchMode: "page",
  route: "/admin/tools/dealguard",
  permission: "admin",
  enabled: true,
  category: "operations",
  sortOrder: 2,

  launch: async () => {
    window.location.href = "/admin/tools/dealguard";
  },
};
