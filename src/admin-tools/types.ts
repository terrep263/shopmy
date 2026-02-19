/**
 * Admin Tool Module System - Type Definitions
 * 
 * Defines the core types for the admin tool registry system
 */

export type AdminToolLaunchMode = "panel" | "page" | "modal";

export interface AdminTool {
  /** Unique identifier for the tool */
  id: string;

  /** Display name shown in dashboard */
  name: string;

  /** Brief description of tool functionality */
  description: string;

  /** Material Design icon name (e.g., "mdi-import", "mdi-city") */
  icon: string;

  /** How the tool should be launched */
  launchMode: AdminToolLaunchMode;

  /** Route path for the tool (if launchMode is "page") */
  route?: string;

  /** Permission level required (for future role-based access) */
  permission: "admin" | "super_admin";

  /** Whether tool is currently enabled */
  enabled: boolean;

  /** Category for grouping tools in dashboard */
  category: "operations" | "content" | "management" | "reports";

  /** Sort order within category */
  sortOrder: number;
}

export interface AdminToolModule extends AdminTool {
  /** Launch function to execute the tool */
  launch: () => void | Promise<void>;
}

export interface AdminToolContextValue {
  /** Current active tool (if launched in panel/modal mode) */
  activeTool: string | null;

  /** Launch a tool by ID */
  launchTool: (toolId: string) => void;

  /** Close the currently active tool */
  closeTool: () => void;

  /** Get tool metadata by ID */
  getTool: (toolId: string) => AdminTool | undefined;

  /** Get all enabled tools */
  getEnabledTools: () => AdminTool[];

  /** Get tools by category */
  getToolsByCategory: (category: AdminTool["category"]) => AdminTool[];
}
