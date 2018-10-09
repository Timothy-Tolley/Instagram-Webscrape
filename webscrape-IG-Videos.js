const jsdom = require('jsdom')

const {JSDOM} = jsdom

const TagLink = 'https://www.instagram.com/explore/tags/fruit/'

getVideoShortCodes(TagLink)
  .then(videoShortcodes => {
    return getVideoLinks(videoShortcodes)
    })
  .then(links => {
    // eslint-disable-next-line no-console
    console.log(links)
    })
  .catch(err =>
    // eslint-disable-next-line no-console
    console.error(err.message))

function getVideoShortCodes (tagLink) {
  return JSDOM.fromURL(tagLink, {runScripts: 'dangerously'})
    .then(dom => {
      const nodePath = dom.window._sharedData.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media
      const videoEdges = nodePath.edges.filter(edge => edge.node.is_video)
      const videoShortcodes = videoEdges.map(edge => edge.node.shortcode)
      return Promise.all(videoShortcodes)
    })
}

function getVideoLinks (videoShortcodes) {
  const videoLinks = videoShortcodes.map(shortcode => {
    return getUrl(shortcode)
  })
  return Promise.all(videoLinks)
}

function getUrl (shortcode) {
  const url = 'https://www.instagram.com/p/' + shortcode
  return callJSDom(url)
}

function callJSDom (url) {
  return JSDOM.fromURL(url, {runScripts: 'dangerously'})
    .then(dom => {
      return dom.window._sharedData.entry_data.PostPage[0].graphql.shortcode_media.video_url
    })
}
