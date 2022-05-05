export default {
  name: 'settings',
  type: 'document',
  title: 'Settings',
  __experimental_actions: ['update', 'publish'],
  fieldsets: [{ name: 'typewriter', title: 'Typewriter' }],
  fields: [
    {
      name: 'ngrokUrl',
      title: 'ngrok URL',
      type: 'url',
      readOnly: true,
    },
    {
      name: 'ngrokApiKey',
      title: 'ngrok API key',
      type: 'string',
    },
    {
      name: 'keyMap',
      title: 'DMX key mapping',
      description: 'The DMX channel for each typewriter key. JSON mapping.',
      type: 'text',
      fieldset: 'typewriter',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'charsPerLine',
      title: 'Characters per line',
      description:
        'The maximum number of characters to fit in each line of text.',
      type: 'number',
      fieldset: 'typewriter',
      validation: (Rule) => Rule.required().min(10),
    },
    {
      name: 'carriageReturnSteps',
      title: 'Carriage return motor rotation (steps)',
      description:
        'Stepper motor steps required for a full pull of the carriage. (This only needs to be modified if the typewriter is changed.)',
      type: 'number',
      fieldset: 'typewriter',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'newlineRotationSteps',
      title: 'Newline motor rotation (steps)',
      description:
        'Stepper motor steps required for pulling the newline lever. (This only needs to be modified if the typewriter is changed.)',
      type: 'number',
      fieldset: 'typewriter',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'delaySlow',
      title: 'Stepper motor delay (slow)',
      description: 'Stepper motor delay for "slow" rotation,  in microseconds.',
      type: 'number',
      fieldset: 'typewriter',
    },
    {
      name: 'delayFast',
      title: 'Stepper motor delay (fast)',
      description: 'Stepper motor delay for "fast" rotation,  in microseconds.',
      type: 'number',
      fieldset: 'typewriter',
    },
  ],
}
