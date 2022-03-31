export default {
  name: 'settings',
  type: 'document',
  title: 'Settings',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'ngrokUrl',
      title: 'ngrok URL',
      type: 'url',
      readOnly: true,
    },
  ],
}
