import { prisma } from '@/lib/prisma'
import { DEFAULT_MASTER_CV } from '@/lib/master-cv'
import { MasterCV } from '@/lib/cv-types'
import { generateCVLatex } from '@/lib/latex-cv'
import { compileLaTeX } from '@/lib/latex-compiler'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst()
    let masterCv: MasterCV = DEFAULT_MASTER_CV

    if (profile && profile.masterCv) {
      try {
        masterCv = JSON.parse(profile.masterCv)
      } catch {
        masterCv = DEFAULT_MASTER_CV
      }
    }

    const texCode = generateCVLatex(masterCv)
    const { pdfBuffer } = await compileLaTeX(texCode, { engine: 'lualatex', maxPages: 2 })

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="${masterCv.name.replace(/\s+/g, '_')}_Master_CV.pdf"`)

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers
    })
  } catch (error: unknown) {
    console.error('DOWNLOAD_MASTER_CV_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return Response.json({ error: 'DOWNLOAD_FAILED', details: message }, { status: 500 })
  }
}
