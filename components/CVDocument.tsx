import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'
import { GeneratedCV } from '@/lib/cv-types'

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 44,
    paddingRight: 44,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    fontSize: 8.5,
    color: '#333333',
    flexWrap: 'wrap',
  },
  divider: {
    fontSize: 8.5,
    color: '#666666',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    textAlign: 'justify',
    color: '#222222',
  },
  experienceItem: {
    marginBottom: 7,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 9.5,
    color: '#111111',
  },
  expSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8.5,
    fontStyle: 'italic',
    color: '#444444',
    marginBottom: 3,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 8.5,
    color: '#333333',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#222222',
  },
  skillCategory: {
    marginBottom: 3,
  },
  skillText: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#222222',
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#1a0dab',
    textDecoration: 'underline',
  }
})

export function CVDocument({ data }: { data: GeneratedCV }) {
  if (!data) return null;

  const contactItems = [
    data.location,
    data.phone,
    data.email,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <View style={styles.contactInfo}>
            {contactItems.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text>{item}</Text>
                {(idx < contactItems.length - 1 || data.linkedin || data.website) && (
                  <Text style={styles.divider}>|</Text>
                )}
              </View>
            ))}
            {data.linkedin && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Link style={styles.link} src={data.linkedin}>LinkedIn</Link>
                {data.website && <Text style={styles.divider}>|</Text>}
              </View>
            )}
            {data.website && (
              <Link style={styles.link} src={data.website}>Portfolio</Link>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
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
        )}

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
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
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Projects</Text>
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

        {/* Education */}
        {data.education && data.education.length > 0 && (
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
        )}

        {/* Certifications & Languages */}
        {((data.certifications && data.certifications.length > 0) || (data.languages && data.languages.length > 0)) && (
          <View style={styles.section}>
            {data.certifications && data.certifications.length > 0 && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillText}>
                  <Text style={styles.bold}>Certifications: </Text>
                  {data.certifications.join(' • ')}
                </Text>
              </View>
            )}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.skillCategory}>
                <Text style={styles.skillText}>
                  <Text style={styles.bold}>Languages: </Text>
                  {data.languages.map(l => `${l.language} (${l.level})`).join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
