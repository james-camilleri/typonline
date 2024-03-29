import S from '@sanity/desk-tool/structure-builder'
import {
  RiAsterisk,
  RiChat4Line,
  RiDownload2Line,
  RiDraftLine,
  RiImage2Line,
  RiSettings2Line,
} from 'react-icons/ri'

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Conversations')
        .icon(RiChat4Line)
        .child(
          S.documentList()
            .title('Conversations')
            .filter('_type == "post"')
            .schemaType('post'),
        ),
      S.listItem()
        .title('Media')
        .icon(RiImage2Line)
        .child(
          S.document().title('Media').schemaType('media').documentId('media'),
        ),
      S.divider(),
      S.listItem()
        .title('Phrases')
        .icon(RiDraftLine)
        .child(
          S.documentList()
            .title('Phrases')
            .filter('_type == "phrases"')
            .schemaType('phrases'),
        ),
      // S.divider(),
      // S.listItem()
      //   .title('Performance')
      //   .icon(RiAsterisk)
      //   .child(
      //     S.document()
      //       .title('Performance')
      //       .schemaType('performance')
      //       .documentId('performance'),
      //   ),
      S.listItem()
        .title('Settings')
        .icon(RiSettings2Line)
        .child(
          S.document()
            .title('Settings')
            .schemaType('settings')
            .documentId('settings'),
        ),
      S.divider(),
      S.listItem()
        .title('Feedback')
        .icon(RiDownload2Line)
        .child(
          S.documentList()
            .title('Feedback')
            .filter('_type == "submissionFeedback"')
            .schemaType('submissionFeedback'),
        ),
    ])
