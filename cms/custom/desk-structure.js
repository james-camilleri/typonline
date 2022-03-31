import S from '@sanity/desk-tool/structure-builder'
import { RiDraftLine, RiSettings2Line } from 'react-icons/ri'

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(RiDraftLine)
        .child(
          S.documentList()
            .title('Posts')
            .filter('_type == "post"')
            .schemaType('post'),
        ),
      S.divider(),
      S.listItem()
        .title('Settings')
        .icon(RiSettings2Line)
        .child(
          S.document()
            .title('Settings')
            .schemaType('settings')
            .documentId('settings'),
        ),
    ])
