import { WebImageSchema as webImage } from '@james-camilleri/sanity-web-image'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'

import post from './collections/posts.js'
import settings from './pages/settings.js'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([settings, post, webImage]),
})
