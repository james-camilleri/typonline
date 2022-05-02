export const PAGES = {
  PERFORMANCE: 'performance',
} as const

export type PageId = typeof PAGES[keyof typeof PAGES]
