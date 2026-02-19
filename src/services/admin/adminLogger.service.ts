import { prisma } from "@/lib/prisma"

export async function logAdminAction(
  adminId: string,
  actionType: string,
  entityType: string,
  entityId?: string,
  metadata?: unknown
) {
  await prisma.adminAction.create({
    data: {
      admin_id: adminId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    }
  })
}
