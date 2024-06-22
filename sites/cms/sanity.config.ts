import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import schemaTypes from './schemas/schema'

export default defineConfig({
  name: 'typonline',
  title: 'TypOnline',
  projectId: 'i8yrdmec',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
