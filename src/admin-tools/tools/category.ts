/**
 * Category Manager Tool Module
 * 
 * Create and manage business categories
 */

import { AdminToolModule } from "../types";

export const categoryManagerTool: AdminToolModule = {
  id: "category-manager",
  name: "Category Manager",
  description: "Create and manage business categories",
  icon: "mdi-tag-multiple",
  launchMode: "page",
  route: "/admin/tools/categories",
  permission: "admin",
  enabled: true,
  category: "content",
  sortOrder: 2,

  launch: async () => {
    window.location.href = "/admin/tools/categories";
  },
};
