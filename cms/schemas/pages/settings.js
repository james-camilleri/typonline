export default {
  name: 'pageSettings',
  type: 'document',
  title: 'Settings',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'subtitle',
      type: 'string',
    },
  ],
}
