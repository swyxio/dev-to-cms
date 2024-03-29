## Dev.To CMS

This is a small CMS for dev.to authors. personal use for now but may open up for others to use in future.

Deployed to: https://dev-to-cms.now.sh/

based on

- https://github.com/sw-yx/smaller-safer-serverless-starter
- https://docs.dev.to/api/

## Technologies used

- Next.js
- Tailwind CSS
- Preact
- Monaco Editor
- Formik (replacing React Hook Form)
- React Query: https://github.com/tannerlinsley/react-query
- Tailwind UI: https://tailwindui.com/

## Specs

- [x] give a DEV API key
- [x] list blogposts
- [x] edit blogposts
- [ ] Clone existing post
- [x] create a new post
  - [ ] mark document dirty and prompt before leaving
  - [ ] if dirty, save to local state and restore!
  - [ ] when focused on editor, autoscroll up nicely
  - [ ] keyboard shortcuts for toggling states
  - [x] Redirect to edit after posting
  - [x] Markdown preview with toggles
    - [ ] resize nicely
      - https://stackoverflow.com/questions/47017753/monaco-editor-dynamically-resizable
      - https://github.com/microsoft/monaco-editor/issues/28
      - https://github.com/Microsoft/monaco-editor/issues/71
      - https://github.com/microsoft/monaco-editor/issues/103
      - https://github.com/Microsoft/monaco-editor/issues/543
  - [x] Async status -> nicer UX when clicking submit
    - [x] Disable submit button
    - [x] show spinner while inflight - web component!! https://github.com/craigjennings11/wc-spinners/
    - [x] Show error! - using notifications as a hook!
- [ ] integrate Oauth flow from Ben Halpern
- [x] Monaco Editor

We will not offer deleting blogposts but can unpublish.

Todos:

- sticky header?
- combobox for tags and series?
- image upload?

## Livestreams

- [Day 1 - Setup Next.js and Tailwind UI, list posts through API routes](https://dev.to/swyx/make-your-own-dev-to-cms-livestream-part-1-2ad1) - 90 mins
- [Day 2 - setting up a Markdown Editor with Next.js, Tailwind UI, Highlight.js, React Hook Form, and React Query](https://dev.to/swyx/make-your-own-dev-to-cms-livestream-part-2-6mf) - 3 hours
- Quick Fix - [How To Add Monaco Editor to a Next.js app](https://dev.to/swyx/how-to-add-monaco-editor-to-a-next-js-app-ha3) - 18 mins
- [Day 3 - Refactoring to Edit Existing Posts](https://dev.to/swyx/make-your-own-dev-to-cms-livestream-part-3-c65) - 3 hours
