import { GeneratedCV } from './cv-types'

/**
 * Trim lowest relevance bullet points from a GeneratedCV to fit within page constraints.
 * Prefers trimming longer bullet lists or bullets with lowest priority keyword overlap.
 */
export function trimCVContent(cv: GeneratedCV, targetKeywords: string[] = []): GeneratedCV {
  const cloned: GeneratedCV = JSON.parse(JSON.stringify(cv))

  if (!cloned.experience || cloned.experience.length === 0) {
    return cloned
  }

  // Collect all bullets across experience entries with metadata
  interface BulletMeta {
    expIndex: number
    bulletIndex: number
    text: string
    score: number
  }

  const allBullets: BulletMeta[] = []

  cloned.experience.forEach((exp, expIdx) => {
    if (!exp.responsibilities) return
    exp.responsibilities.forEach((bullet, bulletIdx) => {
      // Score bullet by priority keyword matches
      let score = 0
      const lowerText = bullet.toLowerCase()
      targetKeywords.forEach((kw) => {
        if (lowerText.includes(kw.toLowerCase())) {
          score += 2
        }
      })

      // Prefer keeping items from the most recent role (expIdx === 0)
      score += Math.max(0, (cloned.experience.length - expIdx) * 1.5)

      // Longer/detailed bullets are slightly preferred if equal score
      if (bullet.length > 50) score += 0.5

      allBullets.push({
        expIndex: expIdx,
        bulletIndex: bulletIdx,
        text: bullet,
        score
      })
    })
  })

  if (allBullets.length <= 4) {
    // If very few bullets, don't trim further
    return cloned
  }

  // Sort bullets by score ascending (lowest score first)
  allBullets.sort((a, b) => a.score - b.score)

  // Remove the single lowest-scoring bullet (only if that role has > 2 bullets)
  for (const lowest of allBullets) {
    const roleBullets = cloned.experience[lowest.expIndex].responsibilities
    if (roleBullets && roleBullets.length > 2) {
      roleBullets.splice(lowest.bulletIndex, 1)
      break
    }
  }

  return cloned
}
