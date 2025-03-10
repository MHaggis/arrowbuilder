import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Arrow Builder - Archery Arrow Tuning Calculator',
  description: 'A comprehensive tool for building and tuning archery arrows, calculating FOC, total weight, and optimal arrow configurations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
} 