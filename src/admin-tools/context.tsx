/**
 * Admin Tool Context Provider
 * 
 * Provides context for admin tool management across the admin dashboard
 */
'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { getToolById, ADMIN_TOOL_REGISTRY, getEnabledTools, getToolsByCategory } from '@/admin-tools/registry'
import type { AdminTool, AdminToolContextValue } from '@/admin-tools/types'

const AdminToolContext = createContext<AdminToolContextValue | undefined>(undefined)

export function AdminToolProvider({ children }: { children: React.ReactNode }) {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const launchTool = useCallback((toolId: string) => {
    const tool = getToolById(toolId)
    if (!tool) {
      console.error(`Tool with ID "${toolId}" not found`)
      return
    }

    if (!tool.enabled) {
      console.warn(`Tool "${tool.name}" is disabled`)
      return
    }

    // For page-based tools, navigate using window.location
    if (tool.launchMode === 'page' && tool.route) {
      window.location.href = tool.route
      return
    }

    // For panel/modal tools, set as active (future implementation)
    setActiveTool(toolId)
  }, [])

  const closeTool = useCallback(() => {
    setActiveTool(null)
  }, [])

  const getTool = useCallback((toolId: string) => {
    return getToolById(toolId)
  }, [])

  const contextValue: AdminToolContextValue = {
    activeTool,
    launchTool,
    closeTool,
    getTool,
    getEnabledTools,
    getToolsByCategory,
  }

  return (
    <AdminToolContext.Provider value={contextValue}>
      {children}
    </AdminToolContext.Provider>
  )
}

/**
 * Hook to access admin tool context
 */
export function useAdminTools() {
  const context = useContext(AdminToolContext)
  if (context === undefined) {
    throw new Error('useAdminTools must be used within AdminToolProvider')
  }
  return context
}
