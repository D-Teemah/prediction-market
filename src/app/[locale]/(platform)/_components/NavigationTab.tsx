'use client'

import type { Route } from 'next'
import { ChevronDown, TrendingUpIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useCallback } from 'react'
import { useFilters } from '@/app/[locale]/(platform)/_providers/FilterProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname } from '@/i18n/navigation'

interface NavigationTabProps {
  tag: {
    slug: string
    name: string
    childs: { name: string, slug: string }[]
  }
  childParentMap: Record<string, string>
}

export default function NavigationTab({ tag, childParentMap }: NavigationTabProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isCategoryPage = pathname.startsWith('/category/')
  const categorySlug = isCategoryPage ? pathname.split('/').pop() : null
  const { filters, updateFilters } = useFilters()

  const showBookmarkedOnly = isHomePage ? filters.bookmarked : false
  const tagFromFilters = isHomePage
    ? (showBookmarkedOnly && filters.tag === 'trending' ? '' : filters.tag)
    : isCategoryPage
      ? (categorySlug || 'trending')
      : pathname === '/mentions' ? 'mentions' : 'trending'
  const mainTagFromFilters = isHomePage
    ? (filters.mainTag || childParentMap[tagFromFilters] || tagFromFilters || 'trending')
    : isCategoryPage
      ? (childParentMap[tagFromFilters] || tagFromFilters || 'trending')
      : pathname === '/mentions' ? 'mentions' : 'trending'

  const isActive = mainTagFromFilters === tag.slug

  const handleTagClick = useCallback((targetTag: string, parentTag?: string) => {
    if (targetTag === 'mentions') {
      redirect('/mentions')
    }

    updateFilters({ tag: targetTag, mainTag: parentTag ?? targetTag })
  }, [updateFilters])

  const tabContent = (
    <span className={`flex cursor-pointer items-center gap-1.5 border-b-2 py-2 pb-1 whitespace-nowrap transition-colors ${
      isActive
        ? 'border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
    }`}
    >
      {tag.slug === 'trending' && <TrendingUpIcon className="size-4" />}
      <span>{tag.name}</span>
      {tag.childs.length > 0 && <ChevronDown className="size-3 opacity-50" />}
    </span>
  )

  if (tag.slug === 'mentions') {
    return (
      <Link
        href="/mentions"
        className={`
          flex cursor-pointer items-center gap-1.5 border-b-2 py-2 pb-1 whitespace-nowrap transition-colors
          ${isActive
        ? 'border-primary text-foreground'
        : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
      >
        <span>{tag.name}</span>
      </Link>
    )
  }

  if (tag.childs.length === 0) {
    return (
      <Link
        href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
        onClick={() => tag.slug === 'trending' && handleTagClick(tag.slug)}
        className={`flex cursor-pointer items-center gap-1.5 border-b-2 py-2 pb-1 whitespace-nowrap transition-colors ${
          isActive
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        {tag.slug === 'trending' && <TrendingUpIcon className="size-4" />}
        <span>{tag.name}</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {tabContent}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={(tag.slug === 'trending' ? '/' : `/category/${tag.slug}`) as Route}
            onClick={() => tag.slug === 'trending' && handleTagClick(tag.slug)}
            className="w-full cursor-pointer"
          >
            All
            {' '}
            {tag.name}
          </Link>
        </DropdownMenuItem>
        {tag.childs.map(child => (
          <DropdownMenuItem key={child.slug} asChild>
            <Link
              href={`/category/${child.slug}` as Route}
              onClick={() => tag.slug === 'trending' && handleTagClick(child.slug, tag.slug)}
              className="w-full cursor-pointer"
            >
              {child.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
