import { BrowserRouter, Routes, Route } from 'react-router';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatPage from './pages/ChatPage';
import { useLayoutEffect } from 'react';
import GuestRoute from './pages/wrappers/GuestRoute';
import UserRoute from './pages/wrappers/UserRoute';

function App() {
  const userPrefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  useLayoutEffect(() => {
    if (userPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userPrefersDark]);

  return (
    <BrowserRouter basename='/chatgyan'>
      <Routes>
        <Route element={<UserRoute />}>
          <Route path='/dashboard' element={<ChatPage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
