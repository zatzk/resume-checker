import { NextRequest, NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'NO_FILE_UPLOADED' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const data = await pdf(buffer)

    return NextResponse.json({ text: data.text })
  } catch (error: unknown) {
    console.error('PDF_EXTRACTION_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return NextResponse.json({ error: 'EXTRACTION_FAILED', details: message }, { status: 500 })
  }
}
