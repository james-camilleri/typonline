export default {
  name: 'post',
  type: 'document',
  title: 'Posts',
  fields: [
    {
      name: 'conversation',
      type: 'array',
      of: [
        {
          name: 'phrase',
          type: 'object',
          fields: [
            { name: 'entity', type: 'string' },
            { name: 'text', type: 'string' },
          ],
        },
      ],
      readonly: true,
    },
    {
      name: 'seeds',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      layout: 'tags',
    },
    {
      name: 'poem',
      type: 'text',
    },
    {
      name: 'public',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      poem: 'poem',
      date: '_createdAt',
    },
    prepare({ poem, date }) {
      return {
        title: poem.trim(),
        subtitle: new Date(date).toLocaleString(),
      }
    },
  },
}
