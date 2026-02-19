/**
 * Business Importer Tool Module
 * 
 * Allows admins to import businesses from Google Places by city and category
 */

import { AdminToolModule } from "../types";

export const importerTool: AdminToolModule = {
  id: "importer",
  name: "Business Importer",
  description: "Import businesses from Google Places by city and category",
  icon: "mdi-import",
  launchMode: "page",
  route: "/admin/tools/importer",
  permission: "admin",
  enabled: true,
  category: "operations",
  sortOrder: 1,

  launch: async () => {
    // Launch logic handled by Next.js routing
    window.location.href = "/admin/tools/importer";
  },
};
