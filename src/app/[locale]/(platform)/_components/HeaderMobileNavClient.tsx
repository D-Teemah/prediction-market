'use client'

import type { Route } from 'next'
import { MenuIcon, TrendingUpIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Link } from '@/i18n/navigation'

interface HeaderMobileNavClientProps {
  tags: {
    slug: string
    name: string
    childs: { name: string, slug: string }[]
  }[]
}

export default function HeaderMobileNavClient({ tags }: HeaderMobileNavClientProps) {
  const [open, setOpen] = useState(false)

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
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="flex max-h-[calc(100vh-200px)] flex-col gap-1 overflow-y-auto p-4 pt-0">
          {tags.map(tag => (
            <div key={tag.slug} className="flex flex-col">
              {tag.childs.length === 0
                ? (
                    <Link
                      href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 py-3 text-lg font-medium"
                    >
                      {tag.slug === 'trending' && <TrendingUpIcon className="size-5" />}
                      {tag.name}
                    </Link>
                  )
                : (
                    <div className="flex flex-col">
                      <Link
                        href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3 text-lg font-medium"
                      >
                        <div className="flex items-center gap-2">
                          {tag.slug === 'trending' && <TrendingUpIcon className="size-5" />}
                          {tag.name}
                        </div>
                      </Link>
                      <div className="ml-4 flex flex-col border-l pl-4">
                        {tag.childs.map(child => (
                          <Link
                            key={child.slug}
                            href={`/category/${child.slug}` as Route}
                            onClick={() => setOpen(false)}
                            className="py-2 text-base text-muted-foreground hover:text-foreground"
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
      </DrawerContent>
    </Drawer>
  )
}
