# wshp
A web application focused on **w**or**sh**i**p**, editing, availability and security.

* **Worship**: the main content is the Bible and Hymns, but other worship related content can be published
* **Simplicity**: as it have a simple name it also needs to have a simple interface
* **Availability**: make it as a website to make it simpler to access but also have desktop and mobile versions so it continues working even if some financial crisis take the servers down

## Tools

Currently the focus is choosing what tools are going to be used to get the objectives above. Probably the following:

* [vue.js](https://vuejs.org/) as the view layer
* [WebTorrent](https://github.com/feross/webtorrent) for the P2P part
* [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) or [TweetNaCl.js](https://github.com/dchest/tweetnacl-js/) to provide security to the P2P updating
* [remark](https://github.com/wooorm/remark), as a markdown subset is planned to be used in hymns and biblical studies
* [OSIS XML Schema](http://www.bibletechnologies.net/) for the Bible
* [JSZip](https://stuk.github.io/jszip/) to allow data being compressed in transit (as WebTorrent don't compress data)
* [Electron](https://electron.atom.io/) for the desktop application
* [Weex](https://weex.incubator.apache.org/) for the mobile applications
