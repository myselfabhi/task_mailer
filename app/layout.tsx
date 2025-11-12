import './globals.css'

export const metadata = {
  title: 'Daily Task Entry',
  description: 'Daily task entry and email reporting system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


