# Todo _(linear order)_

- [x] routing:
  - [x] `/` is landing page
  - [x] if not logged in, `u/...` and `b/...` redirects to `/signin` before fetching
- [x] supabase auth
- [x] dynamic page title (Helmet)
- [x] use `tanstack-query` to store user / session info
- [x] fix query auto refetching
- [x] after sign in, redirect to `u/:userId/boards`
- [x] after sign out, redirect to `/`
- [x] supabase: `boards` and `board_members` READ policies should be restricted to `authenticated`
- [x] add lists with lexorank drag-n-drop
  - [x] add `list` schema on `supabase`
  - [x] write policies: ALL: auth & board members only
  - create `CreateListForm` in `Board`
  - [x] render with a `<List />` component
  - [x] add optimistic update
  - [ ] create 4 default lists (in JAVASCRIPT because I need `lexorank`) when creating a new board
- [ ] database design
- [x] fix: janky animation when dragging lists (solve before making cards / checklists / checklist items...) [GitHub issue](https://github.com/clauderic/dnd-kit/issues/921)
- [ ] cards
  - [ ] `supabase` table, triggers, queries & mutations
  - [ ] `<Card />` (draggable) 
  - [ ] routing (`/c/:cardId`)

