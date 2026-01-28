import { Link } from '@/i18n/navigation'

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background py-12 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">{process.env.NEXT_PUBLIC_SITE_NAME || 'Prediction Market'}</h3>
            <p className="max-w-xs leading-relaxed">
              The world's most transparent prediction market. Trade on news, politics, tech, and more.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="transition-colors hover:text-foreground">Markets</Link></li>
              <li><Link href="/create" className="transition-colors hover:text-foreground">Create Market</Link></li>
              <li><Link href="/leaderboard" className="transition-colors hover:text-foreground">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" className="transition-colors hover:text-foreground">Documentation</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-foreground">Help Center</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="transition-colors hover:text-foreground">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p>
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            {process.env.NEXT_PUBLIC_SITE_NAME}
            . All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Social links placeholders */}
            <a href="#" className="transition-colors hover:text-foreground">Twitter</a>
            <a href="#" className="transition-colors hover:text-foreground">Discord</a>
            <a href="#" className="transition-colors hover:text-foreground">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
