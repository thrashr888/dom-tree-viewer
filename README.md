
DOM Tree Viewer
===============

This is a modal that displays the DOM tree of the current page. It is available as a bookmarklet to drop on any (non-https) site.


Install
-----

    > npm install


Run
---

A simple server is used to serve index.html for dev, and creates a compiled version in `./dist` for use as a bookmarklet.

    > gulp
    > open http://localhost:8080/


Bookmarklet
-----------

The url is found at `http://localhost:8080/`.

Sites tested on:

- http://facebook.github.io/react/docs/component-api.html
- http://stackoverflow.com/questions/tagged/javascript
- http://gulpjs.com/plugins/


TODO
----

- Build inlined CSS & sprite image data in order to get it working on HTTPS due to CORS.
- Add tests.
