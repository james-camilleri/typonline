export default {
  name: 'phrases',
  type: 'document',
  title: 'Phrases',
  fields: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'phrases',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}
