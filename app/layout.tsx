import SidebarLayout from '@/components/SidebarLayout'
import { AnalysisProvider } from '@/components/AnalysisProvider'
import './globals.css'

export const metadata = {
  title: 'Smart CV Application Manager',
  description: 'Terminal Industrial CV Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;700&family=Hanken+Grotesk:wght@600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AnalysisProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </AnalysisProvider>
      </body>
    </html>
  )
}
