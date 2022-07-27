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
  ],
}
