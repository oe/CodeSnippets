const download = require('./download.js')
const fs = require('fs')
const path = require('path')

const links = fs.readFileSync('./image-links.txt', 'utf8').split('\n')
async function main() {
  const dir = path.join(__dirname, 'downloaded')
  fs.mkdirSync(dir)
  for (let link of links) {
    console.log('link', link)
    await download({
      url: link,
      dest: path.join(dir, link.replace('https://images.unsplash.com/photo-', '').replace(/\?.*$/, '.jpg'))
    })
  }
}

main()