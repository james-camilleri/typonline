import { WebImageSchema as webImage } from '@james-camilleri/sanity-web-image'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'

import post from './cms/schemas/collections/posts.js'
import pageSettings from './cms/schemas/pages/settings.js'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([pageSettings, post, webImage]),
})
