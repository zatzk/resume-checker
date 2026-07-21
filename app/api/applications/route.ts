import { prisma } from '@/lib/prisma'
import { trackerData } from '@/lib/mockData'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let apps = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { cvs: true }
    })

    // Seed default applications if database is empty
    if (apps.length === 0) {
      for (const item of trackerData.applications) {
        await prisma.application.create({
          data: {
            company: item.company,
            role: item.role,
            status: item.status.replace(/\s+/g, '_'),
            salaryRange: item.salary,
            link: item.link || '',
            requirements: item.requirements || ''
          }
        })
      }
      apps = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
        include: { cvs: true }
      })
    }

    return Response.json(apps)
  } catch (error: unknown) {
    console.error('APPLICATIONS_GET_FAILED:', error)
    return Response.json({ error: 'FAILED_TO_FETCH_APPLICATIONS' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { company, role, salaryRange, link, requirements, notes } = await req.json()

    if (!company || !role) {
      return Response.json({ error: 'Company and Role are required' }, { status: 400 })
    }

    const newApp = await prisma.application.create({
      data: {
        company,
        role,
        status: 'CV_SENT',
        salaryRange: salaryRange || '',
        link: link || '',
        requirements: requirements || '',
        notes: notes || ''
      }
    })

    return Response.json(newApp, { status: 201 })
  } catch (error: unknown) {
    console.error('APPLICATION_CREATE_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ error: 'FAILED_TO_CREATE_APPLICATION', details: message }, { status: 500 })
  }
}
