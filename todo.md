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
  - [ ] fix that bug: janky animation when dragging lists
  - [ ] create 4 default lists (in JAVASCRIPT because I need `lexorank`) when creating a new board
- dnd:
  - [ ] bring card query to `<Board>`
    - [ ] save multiple rows into a variable - plpgsql
    - [ ] write `getAllCardsOfBoard` RPC function
  - [ ] a state `items`: 
   - every item that can be dragged (both `Card`s and `List`s)
   - update on `dragover` and `dragend`
  - [ ] function `findContainer`:
  ```js
    // a draggable item can be Card or List
    draggedId === 'B2' => return 'B'
    draggedId === 'B' => return 'B'
  ```
