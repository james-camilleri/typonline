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
          name: 'questionAndAnswer',
          type: 'object',
          fields: [
            { name: 'question', type: 'string' },
            { name: 'answer', type: 'string' },
          ],
        },
        {
          name: 'phrase',
          type: 'object',
          fields: [{ name: 'phrase', type: 'string' }],
        },
      ],
      readonly: true,
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
