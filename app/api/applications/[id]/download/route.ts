import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'cv' // 'cv' or 'cover'

    const app = await prisma.application.findUnique({
      where: { id },
      include: { cvs: { orderBy: { createdAt: 'desc' } } }
    })

    if (!app || app.cvs.length === 0) {
      return Response.json({ error: 'No generated CV found for this application' }, { status: 404 })
    }

    const latestCvRecord = app.cvs[0]
    const parsed = JSON.parse(latestCvRecord.content)

    const base64Str = type === 'cover' ? parsed.coverPdfBase64 : parsed.cvPdfBase64

    if (!base64Str) {
      return Response.json({ error: 'PDF content not found' }, { status: 404 })
    }

    const pdfBuffer = Buffer.from(base64Str, 'base64')
    const fileName = `${app.company.replace(/\s+/g, '_')}_${type === 'cover' ? 'Cover_Letter' : 'CV'}.pdf`

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `inline; filename="${fileName}"`)

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers
    })
  } catch (error: unknown) {
    console.error('DOWNLOAD_PDF_FAILED:', error)
    return Response.json({ error: 'FAILED_TO_DOWNLOAD_PDF' }, { status: 500 })
  }
}
