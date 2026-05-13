import { NextRequest, NextResponse } from 'next/server'
import 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'NO_FILE_UPLOADED' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // PDFParse 2.x is a class and requires instantiation
    const parser = new PDFParse({ data: buffer })
    const data = await parser.getText()

    return NextResponse.json({ text: data.text })
  } catch (error: unknown) {
    console.error('PDF_EXTRACTION_FAILED:', error)
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return NextResponse.json({ error: 'EXTRACTION_FAILED', details: message }, { status: 500 })
  }
}
