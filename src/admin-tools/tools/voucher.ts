/**
 * Voucher Manager Tool Module
 * 
 * View and manage customer vouchers
 */

import { AdminToolModule } from "../types";

export const voucherManagerTool: AdminToolModule = {
  id: "voucher-manager",
  name: "Voucher Manager",
  description: "View and manage customer vouchers",
  icon: "mdi-ticket-confirmation",
  launchMode: "page",
  route: "/admin/tools/vouchers",
  permission: "admin",
  enabled: true,
  category: "management",
  sortOrder: 2,

  launch: async () => {
    window.location.href = "/admin/tools/vouchers";
  },
};
