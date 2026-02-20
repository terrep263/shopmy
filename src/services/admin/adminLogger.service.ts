import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"

export async function logAdminAction(
  adminId: string | null | undefined,
  actionType: string,
  entityType: string,
  entityId?: string,
  metadata?: unknown
) {
  // Skip logging if no valid adminId
  if (!adminId) {
    console.warn(`[logAdminAction] Skipped — no adminId for ${actionType} on ${entityType}`)
    return
  }

  await prisma.adminAction.create({
    data: {
      id: randomUUID(),
      admin_id: adminId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    }
  })
}
