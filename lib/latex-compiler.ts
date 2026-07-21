import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'
import util from 'util'

const execPromise = util.promisify(exec)

export interface ATSReport {
  extractableTextLength: number
  hasLiteralEmail: boolean
  hasLiteralPhone: boolean
  pageCount: number
  keywordCoverage: { keyword: string; matched: boolean }[]
  passChecks: {
    cleanExtraction: boolean
    contactDetailsVisible: boolean
    pageCountEnforced: boolean
  }
}

export interface CompileResult {
  pdfBuffer: Buffer
  pageCount: number
  atsReport: ATSReport
}

/**
 * Compiles a LaTeX string to PDF, validates ATS text extraction, and enforces page counts.
 */
export async function compileLaTeX(
  latexCode: string,
  options: {
    engine?: 'lualatex' | 'xelatex' | 'pdflatex'
    maxPages?: number
    targetKeywords?: string[]
  } = {}
): Promise<CompileResult> {
  const engine = options.engine || 'lualatex'
  const maxPages = options.maxPages || 2
  const targetKeywords = options.targetKeywords || []

  // Create temporary directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv_compile_'))
  const texFile = path.join(tmpDir, 'document.tex')
  const pdfFile = path.join(tmpDir, 'document.pdf')
  const txtFile = path.join(tmpDir, 'document.txt')

  try {
    fs.writeFileSync(texFile, latexCode, 'utf-8')

    // Run compile engine (nonstopmode)
    const compileCmd = `${engine} -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`
    
    try {
      await execPromise(compileCmd, { cwd: tmpDir, timeout: 30000 })
    } catch (compileErr: unknown) {
      // Check if PDF was generated despite non-fatal LaTeX warnings
      if (!fs.existsSync(pdfFile)) {
        const logFile = path.join(tmpDir, 'document.log')
        const logContent = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf-8') : ''
        throw new Error(`LaTeX Compilation Failed (${engine}): ${logContent.slice(-1000) || compileErr}`)
      }
    }

    if (!fs.existsSync(pdfFile)) {
      throw new Error(`PDF creation failed: ${pdfFile} does not exist.`)
    }

    const pdfBuffer = fs.readFileSync(pdfFile)

    // Run pdftotext for ATS text extraction & page counting
    let extractedText = ''
    let pageCount = 1

    try {
      await execPromise(`pdftotext -layout "${pdfFile}" "${txtFile}"`, { cwd: tmpDir })
      if (fs.existsSync(txtFile)) {
        extractedText = fs.readFileSync(txtFile, 'utf-8')
      }
    } catch (pdfTextErr) {
      console.warn('pdftotext execution warning:', pdfTextErr)
    }

    // Estimate or extract exact page count using pdftotext page break character \f (form feed)
    if (extractedText) {
      const pageBreaks = extractedText.split('\f')
      pageCount = pageBreaks.length > 0 ? pageBreaks.length - (pageBreaks[pageBreaks.length - 1] === '' ? 1 : 0) : 1
    }

    // ATS checks
    const hasLiteralEmail = /[\w.-]+@[\w.-]+\.\w+/.test(extractedText)
    const hasLiteralPhone = /[\+\d\s\(\)\-]{7,}/.test(extractedText)
    const cleanExtraction = extractedText.length > 100 && !extractedText.includes('(cid:')

    const keywordCoverage = targetKeywords.map((kw) => ({
      keyword: kw,
      matched: extractedText.toLowerCase().includes(kw.toLowerCase())
    }))

    const atsReport: ATSReport = {
      extractableTextLength: extractedText.length,
      hasLiteralEmail,
      hasLiteralPhone,
      pageCount,
      keywordCoverage,
      passChecks: {
        cleanExtraction,
        contactDetailsVisible: hasLiteralEmail || hasLiteralPhone,
        pageCountEnforced: pageCount <= maxPages
      }
    }

    return {
      pdfBuffer,
      pageCount,
      atsReport
    }
  } finally {
    // Cleanup temporary folder asynchronously
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    } catch (cleanupErr) {
      // Ignore cleanup error
    }
  }
}
