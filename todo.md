# Todo *(linear order)*

- [x] routing:
  - [x] `/` is landing page
  - [x] if not logged in, `u/...` and `b/...` redirects to `/signin` before fetching
- [x] supabase auth
- [x] dynamic page title (Helmet)
- [x] use `tanstack-query` to store user / session info
- [x] fix query auto refetching
- [x] after sign in, redirect to `u/:userId/boards`
- [x] after sign out, redirect to `/`
- [ ] database design