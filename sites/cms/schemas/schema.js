import { WebImage } from '@james-camilleri/sanity-web-image/schema'

import phrases from './collections/phrases.js'
import post from './collections/posts.js'
import submissionFeedback from './form-submissions/feedback.js'
import media from './pages/media.js'
import performance from './pages/performance.js'
import settings from './pages/settings.js'

export default [
  media,
  performance,
  phrases,
  post,
  settings,
  submissionFeedback,
  WebImage,
]
