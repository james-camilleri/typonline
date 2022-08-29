import { fireEvent } from '$lib/connection'

interface Colour {
  r: number
  g: number
  b: number
}

export const COLOUR: Record<string, Colour> = {
  RED: { r: 255, g: 0, b: 0 },
  ORANGE: { r: 255, g: 50, b: 0 },
  AMBER: { r: 255, g: 255, b: 0 },
  GREEN: { r: 0, g: 255, b: 0 },
  WHITE: { r: 255, g: 255, b: 255 },
} as const

export async function setStatusLight(colour: Colour) {
  fireEvent({
    type: 'status-light',
    data: colour,
  })
}
