import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

interface CVData {
  name?: string
  role?: string
  techStack?: string[]
  experience?: string
  targetRole?: string
  targetCompany?: string
}

// Define a simple style for the CV
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#131313',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 12,
    color: '#333333',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#FFB300',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 2,
  },
  text: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    fontSize: 8,
    backgroundColor: '#F5F5F5',
    padding: '2 5',
    borderWidth: 0.5,
    borderColor: '#DDDDDD',
  }
})

export function CVDocument({ data }: { data: CVData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || 'Your Name'}</Text>
          <Text style={styles.role}>{data.role || 'Professional Role'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Stack</Text>
          <View style={styles.grid}>
            {(data.techStack || []).map((tech: string, i: number) => (
              <Text key={i} style={styles.tag}>{tech}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          <Text style={styles.text}>{data.experience || 'Experience details will be mapped here...'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Targeted Alignment</Text>
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            This CV was automatically optimized for the {data.targetRole} role at {data.targetCompany}.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
