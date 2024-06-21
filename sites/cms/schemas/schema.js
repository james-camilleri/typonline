import { WebImageSchema as webImage } from '@james-camilleri/sanity-web-image'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import createSchema from 'part:@sanity/base/schema-creator'

import phrases from './collections/phrases.js'
import post from './collections/posts.js'
import submissionFeedback from './form-submissions/feedback.js'
import media from './pages/media.js'
import performance from './pages/performance.js'
import settings from './pages/settings.js'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    media,
    performance,
    phrases,
    post,
    settings,
    submissionFeedback,
    webImage,
  ]),
})
