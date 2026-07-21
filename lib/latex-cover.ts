import { escapeLatex } from './latex-cv'

export interface CoverLetterData {
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  candidateLocation?: string
  linkedin?: string
  companyName: string
  roleTitle: string
  recipientName?: string
  openingParagraph: string
  bodyParagraph: string
  bulletPoints?: { label: string; text: string }[]
  connectionParagraph?: string
  closingParagraph?: string
}

export function generateCoverLetterLatex(data: CoverLetterData): string {
  const nameParts = (data.candidateName || 'Candidate Name').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const recipient = escapeLatex(data.recipientName || 'Dear Hiring Manager,')
  const opening = escapeLatex(data.openingParagraph)
  const body = escapeLatex(data.bodyParagraph)
  const connection = data.connectionParagraph ? escapeLatex(data.connectionParagraph) : ''
  const closing = data.closingParagraph ? escapeLatex(data.closingParagraph) : 'I look forward to discussing how my experience aligns with your team goals.'

  let bulletsTex = ''
  if (data.bulletPoints && data.bulletPoints.length > 0) {
    bulletsTex = `
\\begin{itemize}
${data.bulletPoints
  .map((b) => `  \\item \\textbf{${escapeLatex(b.label)}}: ${escapeLatex(b.text)}`)
  .join('\n')}
\\end{itemize}
\\vspace{6pt}
`
  }

  const contactLine = [
    data.candidateEmail ? `\\href{mailto:${escapeLatex(data.candidateEmail)}}{${escapeLatex(data.candidateEmail)}}` : '',
    data.candidatePhone ? escapeLatex(data.candidatePhone) : '',
    data.candidateLocation ? escapeLatex(data.candidateLocation) : '',
    data.linkedin ? `\\href{${data.linkedin}}{LinkedIn}` : ''
  ].filter(Boolean).join(' | ')

  return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{blue}

\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    pdftitle={Cover Letter - ${escapeLatex(data.companyName)} - ${escapeLatex(data.roleTitle)}},
}
\\usepackage[scale=0.80]{geometry}

\\name{${escapeLatex(firstName)}}{${escapeLatex(lastName)}}
\\address{${escapeLatex(data.candidateLocation || '')}}{}{}
${data.candidatePhone ? `\\phone[mobile]{${escapeLatex(data.candidatePhone)}}` : ''}
${data.candidateEmail ? `\\email{${escapeLatex(data.candidateEmail)}}` : ''}
${data.linkedin ? `\\extrainfo{\\href{${data.linkedin}}{LinkedIn}}` : ''}

\\begin{document}

\\makecvtitle

\\vspace{10pt}

\\today

\\vspace{12pt}

\\textbf{Re: Application for ${escapeLatex(data.roleTitle)} at ${escapeLatex(data.companyName)}}

\\vspace{12pt}

${recipient}

\\vspace{8pt}

${opening}

\\vspace{8pt}

${body}

${bulletsTex}

${connection ? `${connection}\n\n\\vspace{8pt}` : ''}

${closing}

\\vspace{16pt}

Sincerely,\\\\
\\vspace{12pt}
\\textbf{${escapeLatex(data.candidateName)}}

\\end{document}
`
}
