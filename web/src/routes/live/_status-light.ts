import { browser } from '$app/environment'
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
  BLUE: { r: 0, g: 0, b: 255 },
  CYAN: { r: 0, g: 255, b: 255 },
  WHITE: { r: 255, g: 255, b: 255 },
  GREY: { r: 80, g: 80, b: 50 },
} as const

export function adjustColour(colour: Colour, opacity?: number) {
  if (opacity == null) {
    return colour
  }

  return {
    r: Math.floor(colour.r * opacity),
    g: Math.floor(colour.g * opacity),
    b: Math.floor(colour.b * opacity),
  }
}

export async function setStatusLight(...colours: Colour[]) {
  if (!browser) return

  fireEvent({
    type: 'status-light',
    data: colours,
  })
}
