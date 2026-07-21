import { prisma } from '@/lib/prisma'
import { DEFAULT_MASTER_CV } from '@/lib/master-cv'
import { MasterCV } from '@/lib/cv-types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst()

    if (!profile || !profile.masterCv) {
      return Response.json(DEFAULT_MASTER_CV)
    }

    const masterCv: MasterCV = JSON.parse(profile.masterCv)
    return Response.json(masterCv)
  } catch (error: unknown) {
    console.error('PROFILE_GET_FAILED:', error)
    return Response.json(DEFAULT_MASTER_CV)
  }
}

export async function PUT(req: Request) {
  try {
    const masterCv: MasterCV = await req.json()

    if (!masterCv || !masterCv.name) {
      return Response.json({ error: 'Valid Master CV object is required' }, { status: 400 })
    }

    const existing = await prisma.userProfile.findFirst()

    if (existing) {
      await prisma.userProfile.update({
        where: { id: existing.id },
        data: {
          masterCv: JSON.stringify(masterCv),
          techStack: JSON.stringify(masterCv.skills || []),
          rawText: masterCv.summary || ''
        }
      })
    } else {
      await prisma.userProfile.create({
        data: {
          masterCv: JSON.stringify(masterCv),
          techStack: JSON.stringify(masterCv.skills || []),
          rawText: masterCv.summary || ''
        }
      })
    }

    return Response.json({ success: true, masterCv })
  } catch (error: unknown) {
    console.error('PROFILE_PUT_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ error: 'PROFILE_SAVE_FAILED', details: message }, { status: 500 })
  }
}
