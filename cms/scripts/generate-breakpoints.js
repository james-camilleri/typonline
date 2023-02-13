const sanityClient = require('@sanity/client')

const { SANITY_API_KEY } = process.env
const client = sanityClient({
  projectId: 'i8yrdmec',
  apiVersion: '2022-03-01',
  dataset: 'production',
  token: SANITY_API_KEY,
  useCdn: false,
})

const query = `
  *[ _type == "sanity.imageAsset" && metadata.breakpoints == null ]
`

client
  .fetch(query)
  .then(async (images) => {
    console.log('deleting the image')
    await client.delete(images[0]._id)
    return

    console.log(`Queueing breakpoint generation for ${images.length} images.`)
    Promise.all(
      images.map((image) =>
        fetch(
          'https://manage.fondazzjoniu.org/.netlify/functions/optimise-image',
          { method: 'POST', body: JSON.stringify(image) },
        ),
      ),
    )
  })
  .catch((err) => {
    if (err.message.includes('Insufficient permissions')) {
      console.error(err.message)
    } else {
      console.error(err.stack)
    }
  })
