export default {
  name: 'media',
  type: 'document',
  title: 'Media',
  fields: [
    {
      name: 'images',
      type: 'array',
      of: [{ type: 'webImage' }],
      options: { hotspot: true },
    },
  ],
}
