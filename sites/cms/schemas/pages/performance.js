export default {
  name: 'performance',
  type: 'document',
  title: 'Performance',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'phrases',
      title: 'Pre-set phrases',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(10),
    },
    {
      name: 'questions',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
}
