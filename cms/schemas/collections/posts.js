export default {
  name: 'post',
  type: 'document',
  title: 'Posts',
  fields: [
    {
      name: 'post',
      type: 'text',
    },
  ],
  preview: {
    select: {
      post: 'post',
      date: '_createdAt',
    },
    prepare({ post, date }) {
      return {
        title: post.trim(),
        subtitle: new Date(date).toLocaleString(),
      }
    },
  },
}
