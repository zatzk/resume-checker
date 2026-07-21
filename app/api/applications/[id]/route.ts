import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const app = await prisma.application.findUnique({
      where: { id },
      include: { cvs: { include: { reports: true } } }
    })

    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 })
    }

    return Response.json(app)
  } catch (error: unknown) {
    console.error('APPLICATION_GET_FAILED:', error)
    return Response.json({ error: 'FAILED_TO_FETCH_APPLICATION' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await req.json()

    const updated = await prisma.application.update({
      where: { id },
      data: updates
    })

    return Response.json(updated)
  } catch (error: unknown) {
    console.error('APPLICATION_UPDATE_FAILED:', error)
    return Response.json({ error: 'FAILED_TO_UPDATE_APPLICATION' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.application.delete({
      where: { id }
    })

    return Response.json({ success: true })
  } catch (error: unknown) {
    console.error('APPLICATION_DELETE_FAILED:', error)
    return Response.json({ error: 'FAILED_TO_DELETE_APPLICATION' }, { status: 500 })
  }
}
