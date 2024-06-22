export const PAGES = {
  PERFORMANCE: 'performance',
  MEDIA: 'media',
} as const

export type PageId = typeof PAGES[keyof typeof PAGES]
