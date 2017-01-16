# wshp.tk
A web application focused on worship, editing, availability and security.

* **Worship**: the main content is the Bible and Hymns, but other worship related content can be published
* **Editing**: everything can be edited, from the Bible to the Hymns (following [Rev 22:18-19](https://www.bible.com/ja/bible/1/rev.22.18-19) is up to the editor)
* **Availability**: aiming to have a website version, a desktop version, and mobile versions, with P2P updating
* **Security**: as P2P is involved security is a basic requiriment

## Tools

Currently the focus is choosing what tools are going to be used to get the objectives above. Probally the following:

* [vue.js](https://vuejs.org/) as the view layer
* [WebTorrent](https://github.com/feross/webtorrent) for the P2P part
* [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) or [TweetNaCl.js](https://github.com/dchest/tweetnacl-js/)
* [remark](https://github.com/wooorm/remark), as a markdown subset is planned to be used in hymns and biblical studies
* [OSIS XML Schema](http://www.bibletechnologies.net/) for the Bible
* [JSZip](https://stuk.github.io/jszip/) to allow data being compressed in transit (as BitTorrent don't compress data)

## Roadmap

* [ ] Determine the objectives of the project
* [ ] Choose which tools will be used
* [ ] Create schemas for the data used
* [ ] Implement (which will be detailed later)

The previous items will be detailed in specific GitHub Issues and they're open to discussion.
