/**
 * City Manager Tool Module
 * 
 * Create and manage cities for business imports
 */

import { AdminToolModule } from "../types";

export const cityManagerTool: AdminToolModule = {
  id: "city-manager",
  name: "City Manager",
  description: "Create and manage cities for business imports",
  icon: "mdi-city",
  launchMode: "page",
  route: "/admin/tools/cities",
  permission: "admin",
  enabled: true,
  category: "content",
  sortOrder: 1,

  launch: async () => {
    window.location.href = "/admin/tools/cities";
  },
};
