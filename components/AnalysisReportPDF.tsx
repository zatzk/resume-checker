import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import { AnalysisResults, AnalysisData } from './AnalysisProvider'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    borderBottom: '1.5pt solid #000000',
    paddingBottom: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    fontSize: 9,
    color: '#333333',
  },
  socialsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    fontSize: 9,
    color: '#0000AA',
    marginTop: 3,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#F5F5F5',
    padding: '3 8',
    borderBottom: '0.5pt solid #CCCCCC',
    marginBottom: 8,
    letterSpacing: 1,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
    paddingHorizontal: 8,
    fontStyle: 'italic',
  },
  experienceBlock: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dates: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  role: {
    fontSize: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  location: {
    fontSize: 9,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.3,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 8,
  },
  skill: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eduBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 8,
  },
  eduInfo: {
    fontSize: 10,
  },
  eduDates: {
    fontSize: 9,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 30,
    borderTop: '0.5pt solid #EEEEEE',
    paddingTop: 10,
    textAlign: 'center',
    opacity: 0.3,
    fontSize: 7,
    letterSpacing: 2,
  }
})

export function AnalysisReportPDF({ results }: { data?: AnalysisData, results: AnalysisResults }) {
  const resume = results.generatedCV
  if (!resume) return null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{resume.name || 'FULL NAME'}</Text>
          <View style={styles.contactRow}>
            {resume.email && <Text>{resume.email}</Text>}
            {resume.phone && <Text>• {resume.phone}</Text>}
            {resume.location && <Text>• {resume.location}</Text>}
          </View>
          <View style={styles.socialsRow}>
            {resume.linkedin && <Link src={resume.linkedin}>LINKEDIN</Link>}
            {resume.website && <Link src={resume.website}>PORTFOLIO</Link>}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{resume.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {resume.experience.map((exp, i) => (
            <View key={i} style={styles.experienceBlock} wrap={false}>
              <View style={styles.expHeader}>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.dates}>{exp.dates}</Text>
              </View>
              <View style={styles.roleRow}>
                <Text style={styles.role}>{exp.title}</Text>
                <Text style={styles.location}>{exp.location}</Text>
              </View>
              {exp.responsibilities.map((resp, j) => (
                <View key={j} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{resp}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          <View style={styles.skillsGrid}>
            {resume.skills.map((skill, i) => (
              <Text key={i} style={styles.skill}>▪ {skill}</Text>
            ))}
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resume.education.map((edu, i) => (
            <View key={i} style={styles.eduBlock}>
              <Text style={styles.eduInfo}>{edu.school} — {edu.degree}</Text>
              <Text style={styles.eduDates}>{edu.dates}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>OPTIMIZED BY TERMINAL_CRMS_ENGINE_v4.0</Text>
        </View>
      </Page>
    </Document>
  )
}
