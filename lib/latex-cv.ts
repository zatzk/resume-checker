import { GeneratedCV, MasterCV } from './cv-types'

/**
 * Escape LaTeX special characters in user strings
 */
export function escapeLatex(text: string | undefined | null): string {
  if (!text) return ''
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}

export function generateCVLatex(cv: GeneratedCV | MasterCV): string {
  const nameParts = (cv.name || 'FULL NAME').split(' ')
  const firstName = nameParts[0] || 'FIRST'
  const lastName = nameParts.slice(1).join(' ') || 'LAST'

  const contactLocation = escapeLatex((cv as GeneratedCV).location || (cv as MasterCV).contact?.location || '')
  const contactEmail = escapeLatex((cv as GeneratedCV).email || (cv as MasterCV).contact?.email || '')
  const contactPhone = escapeLatex((cv as GeneratedCV).phone || (cv as MasterCV).contact?.phone || '')
  const contactLinkedin = (cv as GeneratedCV).linkedin || (cv as MasterCV).contact?.linkedin || ''
  const contactWebsite = (cv as GeneratedCV).website || (cv as MasterCV).contact?.portfolio || (cv as MasterCV).contact?.github || ''

  const extrainfoLinks: string[] = []
  if (contactLinkedin) {
    extrainfoLinks.push(`\\href{${contactLinkedin}}{LinkedIn}`)
  }
  if (contactWebsite) {
    extrainfoLinks.push(`\\href{${contactWebsite}}{Portfolio}`)
  }
  const extrainfoTex = extrainfoLinks.join(', ')

  // Format skills section
  let skillsTex = ''
  if (cv.skills && cv.skills.length > 0) {
    skillsTex = `
\\section{Core Competencies}
\\vspace{1pt}
\\begin{itemize}
${cv.skills
  .map(
    (group) =>
      `\\item \\textbf{${escapeLatex(group.category)}}: ${group.items.map((item) => escapeLatex(item)).join(', ')}`
  )
  .join('\n')}
\\end{itemize}
`
  }

  // Format experience section
  let experienceTex = ''
  if (cv.experience && cv.experience.length > 0) {
    experienceTex = `
\\section{Professional Experience}
\\vspace{3pt}
\\begin{itemize}
${cv.experience
  .map((exp) => {
    const dates = escapeLatex(exp.dates)
    const title = escapeLatex(exp.title)
    const company = escapeLatex(exp.company)
    const location = escapeLatex(exp.location)
    const bullets = exp.responsibilities
      ? exp.responsibilities.map((r) => `    \\item ${escapeLatex(r)}`).join('\n')
      : ''

    return `\\needspace{4\\baselineskip}
\\item{\\cventry{${dates}}{${title}}{${company}}{${location}}{\\vspace{1pt}
\\begin{itemize}
${bullets}
\\end{itemize}}}
\\vspace{3pt}`
  })
  .join('\n\n')}
\\end{itemize}
`
  }

  // Format projects section
  let projectsTex = ''
  if (cv.projects && cv.projects.length > 0) {
    projectsTex = `
\\section{Selected Projects}
\\vspace{1pt}
\\begin{itemize}
${cv.projects
  .map((proj) => {
    const projName = escapeLatex(proj.name)
    const desc = escapeLatex(proj.description)
    const subtitle = 'subtitle' in proj && proj.subtitle ? ` (${escapeLatex(proj.subtitle as string)})` : ''
    const link = proj.link ? ` --- \\href{${proj.link}}{Link}` : ''
    return `\\item \\textbf{${projName}${subtitle}}${link}: ${desc}`
  })
  .join('\n')}
\\end{itemize}
`
  }

  // Format education section
  let educationTex = ''
  if (cv.education && cv.education.length > 0) {
    educationTex = `
\\section{Education}
\\vspace{1pt}
\\begin{itemize}
${cv.education
  .map((edu) => {
    const dates = escapeLatex(edu.dates)
    const degree = escapeLatex(edu.degree)
    const school = escapeLatex('school' in edu ? edu.school : (edu as { institution: string }).institution)
    const location = escapeLatex(('location' in edu ? edu.location : '') || '')

    return `\\item{\\cventry{${dates}}{${degree}}{${school}}{${location}}{}{}}`
  })
  .join('\n')}
\\end{itemize}
`
  }

  // Format certifications & languages
  let certsLangTex = ''
  const hasCerts = cv.certifications && cv.certifications.length > 0
  const hasLangs = cv.languages && cv.languages.length > 0

  if (hasCerts || hasLangs) {
    const items: string[] = []
    if (hasCerts) {
      items.push(`\\item \\textbf{Certifications}: ${cv.certifications!.map((c) => escapeLatex(c)).join(' \\textbullet{} ')}`)
    }
    if (hasLangs) {
      const langsStr = cv.languages!
        .map((l) => `${escapeLatex(l.language)} (${escapeLatex(l.level)})`)
        .join(', ')
      items.push(`\\item \\textbf{Languages}: ${langsStr}`)
    }

    certsLangTex = `
\\section{Certifications \\& Languages}
\\vspace{1pt}
\\begin{itemize}
${items.join('\n')}
\\end{itemize}
`
  }

  return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{banking}
\\moderncvcolor{blue}

% Force both first and last name AND section headings to render in moderncv blue
\\renewcommand*{\\firstnamestyle}[1]{{\\fontsize{34}{36}\\bfseries\\upshape\\color{color1}#1}}
\\renewcommand*{\\lastnamestyle}[1]{{\\fontsize{34}{36}\\bfseries\\upshape\\color{color1}#1}}
\\renewcommand*{\\sectionstyle}[1]{{\\sectionfont\\color{color1}#1}}

\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\usepackage{needspace}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=blue,
    pdftitle={${escapeLatex(cv.name)} - CV},
    pdfpagemode=FullScreen,
}
\\usepackage[scale=0.80]{geometry}

\\name{${escapeLatex(firstName)}}{${escapeLatex(lastName)}}
${contactLocation ? `\\address{${contactLocation}}{}{}` : ''}
${contactPhone ? `\\phone[mobile]{${contactPhone}}` : ''}
${contactEmail ? `\\email{${contactEmail}}` : ''}
${extrainfoTex ? `\\extrainfo{${extrainfoTex}}` : ''}

\\begin{document}

\\makecvtitle

${
  cv.summary
    ? `\\vspace{4pt}
\\small{${escapeLatex(cv.summary)}}`
    : ''
}

${skillsTex}
${experienceTex}
${projectsTex}
${educationTex}
${certsLangTex}

\\end{document}
`
}
