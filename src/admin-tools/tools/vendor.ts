/**
 * Vendor Manager Tool Module
 * 
 * Review and manage vendor accounts and status
 */

import { AdminToolModule } from "../types";

export const vendorManagerTool: AdminToolModule = {
  id: "vendor-manager",
  name: "Vendor Manager",
  description: "Review and manage vendor accounts and status",
  icon: "mdi-store",
  launchMode: "page",
  route: "/admin/tools/vendors",
  permission: "admin",
  enabled: true,
  category: "management",
  sortOrder: 1,

  launch: async () => {
    window.location.href = "/admin/tools/vendors";
  },
};
