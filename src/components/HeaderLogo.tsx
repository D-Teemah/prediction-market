import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export default function HeaderLogo() {
  return (
    <Link
      href={'/' as Route}
      className="flex shrink-0 items-center transition-opacity hover:opacity-80"
    >
      <Image
        src="/images/logo.png"
        alt="BABA MARKETS"
        width={200}
        height={40}
        priority
        className="h-6 w-auto lg:h-8"
      />
    </Link>
  )
}
