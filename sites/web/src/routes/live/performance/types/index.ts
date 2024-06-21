export interface Post {
  conversation: {
    _key: string
    entity: 'audience' | 'typewriter'
    text: string
  }[]
  seeds: string[]
  poem: string
}
