/**
 * Admin Logs Tool Module
 * 
 * View platform admin action logs
 */

import { AdminToolModule } from "../types";

export const adminLogsTool: AdminToolModule = {
  id: "admin-logs",
  name: "Admin Logs",
  description: "View platform admin action logs",
  icon: "mdi-file-document-multiple",
  launchMode: "page",
  route: "/admin/tools/logs",
  permission: "admin",
  enabled: true,
  category: "reports",
  sortOrder: 1,

  launch: async () => {
    window.location.href = "/admin/tools/logs";
  },
};
