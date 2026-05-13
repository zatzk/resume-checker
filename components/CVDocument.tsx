import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'

interface GeneratedCV {
  name: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  socials?: { platform: string; url: string }[]
  summary: string
  experience: {
    title: string
    company: string
    location: string
    dates: string
    responsibilities: string[]
  }[]
  skills: {
    category: string
    items: string[]
  }[]
  education: {
    degree: string
    school: string
    location: string
    dates: string
  }[]
  certifications?: string[]
  projects?: {
    name: string
    description: string
    link?: string
  }[]
  languages?: {
    language: string
    level: string
  }[]
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    fontSize: 9,
    color: '#333333',
    flexWrap: 'wrap',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 10,
  },
  expSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 3,
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  skillCategory: {
    marginBottom: 4,
  },
  skillText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#0000EE',
    textDecoration: 'underline',
  }
})

export function CVDocument({ data }: { data: GeneratedCV }) {
  if (!data) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <View style={styles.contactInfo}>
            <Text>{data.location}</Text>
            <Text>|</Text>
            <Text>{data.phone}</Text>
            <Text>|</Text>
            <Text>{data.email}</Text>
            {data.linkedin && (
              <>
                <Text>|</Text>
                <Link style={styles.link} src={data.linkedin}>LinkedIn</Link>
              </>
            )}
            {data.website && (
              <>
                <Text>|</Text>
                <Link style={styles.link} src={data.website}>Website</Link>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.expHeader}>
                <Text style={styles.bold}>{exp.company}</Text>
                <Text>{exp.location}</Text>
              </View>
              <View style={styles.expSubHeader}>
                <Text>{exp.title}</Text>
                <Text>{exp.dates}</Text>
              </View>
              <View style={styles.bulletList}>
                {exp.responsibilities.map((resp, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{resp}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {data.skills.map((skill, index) => (
            <View key={index} style={styles.skillCategory}>
              <Text style={styles.skillText}>
                <Text style={styles.bold}>{skill.category}: </Text>
                {skill.items.join(', ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.expHeader}>
                <Text style={styles.bold}>{edu.school}</Text>
                <Text>{edu.location}</Text>
              </View>
              <View style={styles.expSubHeader}>
                <Text>{edu.degree}</Text>
                <Text>{edu.dates}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Projects if any */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.bold}>{proj.name}</Text>
                  {proj.link && <Link style={styles.link} src={proj.link}>Link</Link>}
                </View>
                <Text style={styles.bulletText}>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications if any */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text style={styles.skillText}>{data.certifications.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
