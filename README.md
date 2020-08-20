![Hanja](docs/assets/hanja_logo.png)

### Repo for quick start with [**Ha**_sura_](https://hasura.io), [**N**_ext_**J**_s_](https://nextjs.org/), [**A**_uth0_](https://www.auth0.com)

## This is a work in progress

- [x] Implement Todo app
  - [x] Integrate front-end with Auth0
  - [x] Use Auth0 auth for Hasura interactions
  - [x] Use subscriptions to load list
  - [x] Use mutations to create add to list
  - [x] Use mutations to toggle completion of items
- [x] Convert to typescript
- [x] Write unit tests
- [ ] Linter/Formatting
- [ ] Persist login session
- [ ] Auto graphql query/types generation
- [ ] Write integration tests
- [ ] Implement event/action backend that integrates with Hasura
  - Some ideas that could leverage this:
  - add emojis to item names
  - notifications
- [ ] Write docs for getting started
- [ ] Provide guide or helper for building Auth0 application
- [ ] Provide docs or helper for deploying
  - [ ] Heroku
  - [ ] Render
  - [ ] Vercel
  - [ ] Others?
- [ ] Make the app look pretty
- [ ] Leverage create-nextjs-app (or something similar, like yo) for helping people get started easily

## Getting Started

1. Create Auth0 Application
   1. SPA
   2. [Rule & API](https://hasura.io/docs/1.0/graphql/manual/guides/integrations/auth0-jwt.html)
   3. [Rule for Syncing Users](https://auth0.com/blog/building-a-collaborative-todo-app-with-realtime-graphql-using-hasura/)
