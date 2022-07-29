export interface Post {
  conversation: { entity: 'audience' | 'typewriter'; text: string }[]
  seeds: string[]
  poem: string
}
