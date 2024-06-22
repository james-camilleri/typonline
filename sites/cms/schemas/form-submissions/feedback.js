export default {
  type: 'document',
  name: 'submissionFeedback',
  title: 'Feedback Form Submission',
  __experimental_actions: ['delete'],

  fields: [
    {
      name: 'name',
      type: 'string',
      readonly: true,
    },
    {
      name: 'email',
      type: 'string',
      readonly: true,
    },
    {
      name: 'message',
      type: 'text',
      readonly: true,
    },
  ],

  preview: {
    select: {
      createdAt: '_createdAt',
      message: 'message',
    },
    prepare({ message, createdAt }) {
      return {
        title: message.slice(0, 255),
        subtitle: new Date(createdAt).toLocaleString(),
      }
    },
  },
}
