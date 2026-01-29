import HeaderMobileNavClient from '@/app/[locale]/(platform)/_components/HeaderMobileNavClient'
import { TagRepository } from '@/lib/db/queries/tag'

export default async function HeaderMobileNav() {
  const { data, globalChilds = [] } = await TagRepository.getMainTags()

  const sharedChilds = globalChilds.map(child => ({ ...child }))
  const baseTags = (data ?? []).map(tag => ({
    ...tag,
    childs: (tag.childs ?? []).map(child => ({ ...child })),
  }))

  const tags = [
    { slug: 'trending', name: 'Trending', childs: sharedChilds },
    { slug: 'new', name: 'New', childs: sharedChilds.map(child => ({ ...child })) },
    ...baseTags,
  ]

  return <HeaderMobileNavClient tags={tags} />
}
