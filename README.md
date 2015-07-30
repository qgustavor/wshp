# wshp.tk
An unusual web application focused on worship, speed and security.

Step by step explanation:

* *unusual web application*: Different from most other web applications nowadays this one don't use third party elements and have a different way to work with modules. The reason is that it made the development more complicated than we expected. More info in below sections.

* *focused on worship*: The main content from the application will be focused on worship, so it will be *other bible website*. Why other? Because I need one ( current bible websites have some problems, I reported those to the owners but they persist ), also it's sufficiently large to create good challenges like "you can't simply cache hundreds of pages with Application Cache".

* *focused on speed*: The name chosen itself shows this point: wshp, an abbreviation of worship. But it's more abroad: we pretend to give this application an PageSpeed score of 100/100 in *all* pages and also work in ways to get content faster, like prefetching via P2P and making it work almost without using the network (i.e. offline).

* *focused on security*: From the above I said we pretend to use P2P, so I can't let any security breach open. We are already using HTTPS (with CloudFlare in Full mode, that's why we choose GitHub pages) and we will use Content Security Policy, WebCrypto and Service Workers. In special this last one will be used to load signed versions of the code and to check if the application isn't being updated in other ways than the expected. Also the Service Worker will generate, in deterministic way, auditable standalone pages that can be downloaded either if the user wants or if a security condition is broken.

## Note about the content:
The project aims to use Bible content but currently don't have any that can be used. For testing and beta versions we can use random content (like lorem ipsum) but will be a lot helpful if is possible to form a partnership with someone that owns a Bible website to provide real content.

## Past of the project:
It is a work from some years ago and I expect that it finally ends. It all started when I needed to present the Bible and at this time all we have is a Word document. After some time some websites like bible.com could help us, but they don't have presentation modes (i.e. font-sizes above 42px) and aren't going to implement it. The best way seemed to do this from the zero.

Some ideas got tested: an single page application, an jQuery based application and finally a React based one, which got super complicated and slow. The problem with libraries is that in this last version I expend more time fixing third party libraries than using those, like removing unused WebSQL code from mozilla/localForage or unsuccessfully trying to remove that non-compliant promise polyfill from lhorie/mithril.js.

The worst and last thing I had to deal is with code re-usage between Service Worker and the Standalone page: no module compiler, like Browserify or Webpack, supports it smoothly. I tried using multiple builds, but it simply duplicated the code, making it worse to read, worse to debug, worse to audit.

If you're a developer from one of those tools and fixed it then pull request this readme. But I don't think it's going to happen: the web lives in the past, Service Workers are in stable builds but we are still supporting browsers with no support to IndexedDB. Worse: IndexedDB still don't have native support to promises (and seems no one made this suggestion)!

## Future of the project:
I expect that it can inspire new APIs for security, so in future will be not be necessary a Service Worker to deploy signed versions of javascript code, users will can control how their applications are updating and verify integrity, like using PGP or other privacy related tool. Those are some ideas that I think that I will be rejected by most contribuitors from those APIs saying "users don't mind for security" so I'm trying to apply those with the tools we have now.

Other thing I want to inspire is that even if I want a HTTPS internet sometimes we are just over engineering it, like encrypting again in the transport something that was encrypted in the application. I will try to use HTTP to reduce server costs on P2P signaling in order to make it cheaper to deploy and allowing it to be more decentralized.
