'use client'

import type { Route } from 'next'
import { useDisconnect } from '@reown/appkit-controllers/react'
import { useAppKitAccount } from '@reown/appkit/react'
import { FileTextIcon, HandCoinsIcon, LayoutDashboardIcon, LogOutIcon, MenuIcon, ShieldCheckIcon, TrendingUpIcon, UserIcon } from 'lucide-react'
import { useExtracted, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useTradingOnboarding } from '@/app/[locale]/(platform)/_providers/TradingOnboardingProvider'
import HeaderPortfolio from '@/components/HeaderPortfolio'
import ThemeSelector from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import UserInfoSection from '@/components/UserInfoSection'
import { useAppKit } from '@/hooks/useAppKit'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useUser } from '@/stores/useUser'

interface HeaderMobileNavClientProps {
  tags: {
    slug: string
    name: string
    childs: { name: string, slug: string }[]
  }[]
}

export default function HeaderMobileNavClient({ tags }: HeaderMobileNavClientProps) {
  const t = useExtracted('Header')
  const [open, setOpen] = useState(false)
  const { open: openAppKit } = useAppKit()
  const { isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { startDepositFlow } = useTradingOnboarding()
  const user = useUser()

  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const isAuthenticated = Boolean(user) || isConnected

  function handleLocaleChange(nextLocale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- next-intl validates that params match the pathname.
        { pathname, params },
        { locale: nextLocale as any },
      )
    })
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="-ms-2 lg:hidden">
          <MenuIcon className="size-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="sr-only">Menu</DrawerTitle>
        </DrawerHeader>
        <div className="flex max-h-[calc(100vh-100px)] flex-col overflow-y-auto">
          {isAuthenticated
            ? (
                <div className="flex flex-col gap-4 border-b p-4">
                  <UserInfoSection />

                  <div className="flex justify-center">
                    <HeaderPortfolio />
                  </div>

                  <Button onClick={startDepositFlow} className="w-full">
                    {t('Deposit')}
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/settings"
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium
                        hover:bg-accent hover:text-accent-foreground
                      `}
                    >
                      <UserIcon className="size-4" />
                      {t('Profile')}
                    </Link>

                    <Link
                      href="/settings/affiliate"
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium
                        hover:bg-accent hover:text-accent-foreground
                      `}
                    >
                      <HandCoinsIcon className="size-4" />
                      {t('Affiliate')}
                    </Link>

                    {user?.is_admin && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className={`
                          flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium
                          hover:bg-accent hover:text-accent-foreground
                        `}
                      >
                        <LayoutDashboardIcon className="size-4" />
                        {t('Admin')}
                      </Link>
                    )}
                  </div>
                </div>
              )
            : (
                <div className="flex flex-col gap-3 border-b p-4">
                  <Button onClick={() => openAppKit()} className="w-full">
                    {t('Sign Up')}
                  </Button>
                  <Button variant="outline" onClick={() => openAppKit()} className="w-full">
                    {t('Log In')}
                  </Button>
                </div>
              )}

          <div className="flex flex-col gap-1 p-4">
            <div className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Explore
            </div>
            {tags.map(tag => (
              <div key={tag.slug} className="flex flex-col">
                {tag.childs.length === 0
                  ? (
                      <Link
                        href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 py-2 text-base font-medium"
                      >
                        {tag.slug === 'trending' && <TrendingUpIcon className="size-4" />}
                        {tag.name}
                      </Link>
                    )
                  : (
                      <div className="flex flex-col">
                        <Link
                          href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 py-2 text-base font-medium"
                        >
                          {tag.slug === 'trending' && <TrendingUpIcon className="size-4" />}
                          {tag.name}
                        </Link>
                        <div className="ml-4 flex flex-col border-l pl-4">
                          {tag.childs.map(child => (
                            <Link
                              key={child.slug}
                              href={`/category/${child.slug}` as Route}
                              onClick={() => setOpen(false)}
                              className="py-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
              </div>
            ))}
          </div>

          <div className="mt-auto border-t p-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/docs/users"
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium
                  hover:bg-accent hover:text-accent-foreground
                `}
              >
                <FileTextIcon className="size-4" />
                {t('Documentation')}
              </Link>

              <Link
                href="/terms-of-use"
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium
                  hover:bg-accent hover:text-accent-foreground
                `}
              >
                <ShieldCheckIcon className="size-4" />
                {t('Terms of Use')}
              </Link>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    disconnect()
                    setOpen(false)
                  }}
                  className={`
                    flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-destructive
                    hover:bg-destructive/10
                  `}
                >
                  <LogOutIcon className="size-4" />
                  {t('Logout')}
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <ThemeSelector />
              <div className="flex items-center gap-2">
                <Button
                  variant={locale === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLocaleChange('en')}
                  className="h-7 px-2"
                  disabled={isPending}
                >
                  EN
                </Button>
                <Button
                  variant={locale === 'es' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLocaleChange('es')}
                  className="h-7 px-2"
                  disabled={isPending}
                >
                  ES
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
