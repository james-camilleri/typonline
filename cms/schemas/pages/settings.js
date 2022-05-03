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
      name: 'keyMap',
      title: 'DMX key mapping',
      description: 'The DMX channel for each typewriter key. JSON mapping.',
      type: 'string',
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
      name: 'newlineRotationDegrees',
      title: 'Carriage motor rotation (degrees)',
      description:
        'Degrees of rotation required for a full pull of the carriage. (This only needs to be modified if the typewriter is changed.)',
      type: 'number',
      fieldset: 'typewriter',
      validation: (Rule) => Rule.required(),
    },
  ],
}
