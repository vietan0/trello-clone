import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Routes, Route } from 'react-router-dom';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import LandingPage from './routes/LandingPage';
import User from './routes/User';
import Boards from './routes/Boards';
import Board from './routes/Board';
import NavLayout from './components/NavLayout';
import NotFound from './routes/NotFound';

export default function App() {
  return (
    <>
      <div id="App">
        <Routes>
          {/* auth routes won't have the shared <Nav /> */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<NavLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="u/:userId" element={<User />} />
            <Route path="u/:userId/boards" element={<Boards />} />
            <Route path="b/:boardId" element={<Board />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Route>
        </Routes>
      </div>
      <ReactQueryDevtools />
    </>
  );
}
