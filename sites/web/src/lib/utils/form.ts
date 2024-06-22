import { STATE, State } from '$lib/components/form/StateButton.svelte'
import type { Field } from '$lib/types/forms'
import { tick } from 'svelte'

const RESET_TIMEOUT = 5000

// Taken from https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression.
export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export function createSubmitHandler(
  url: string,
  form: HTMLFormElement,
  fields: Field[],
  formState: State,
  submitted: boolean,
): (event: Event) => void {
  return async function submit(e) {
    e.preventDefault()

    // Stop multiple submissions.
    if (formState === STATE.WAITING) return

    submitted = true
    await tick() // Await validation before attempting submit.
    if (fields.filter(({ valid }) => !valid).length) return

    formState = STATE.WAITING
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    })

    formState = response.ok ? STATE.SUCCESS : STATE.ERROR
    setTimeout(() => {
      formState = STATE.IDLE
    }, RESET_TIMEOUT)

    if (response.ok) {
      // TODO: This doesn't handle inputs of different types.
      fields = fields.map((field) => ({ ...field, value: '' }))
      submitted = false
    }
  }
}
