import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";

import './App.css';

// Components
import Loading from "./AppUtils/Loading.tsx";
import PublicRoute from "./AppUtils/PublicRoute.tsx";
import ProtectedRoute from "./AppUtils/ProtectedRoute.tsx";
import { useDispatch } from "react-redux";
import { authAdd } from "./Redux/Slice/authSlice.tsx";
import SearchFriends from "./Pages/Home/SearchAccounts.tsx";
import FriendRequests from "./Pages/Home/FriendRequests.tsx";
import Friends from "./Pages/Home/Friends.tsx";
import Profile from "./Pages/Home/Profile.tsx";
import Chat from "./Pages/Home/Chat.tsx";

// Page with lazy load
const SignUp = lazy(() => import("./Pages/Auth/Signup.tsx"));
const Home = lazy(() => import("./Pages/Home/Home.tsx"));
const Login = lazy(() => import("./Pages/Auth/Login.tsx"));
const BACKEND_API = process.env.REACT_APP_BACKEND_API;
function App() {

  const dispatch = useDispatch()
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = async () => {
      try {
        const res = await axios.get(`${BACKEND_API}/auth/checkAuth`,
          { withCredentials: true });
        dispatch(authAdd(res.data.user));
      } catch {
        dispatch(authAdd(null));
      }
      setCheckingAuth(false);
    };
    auth();
  }, [dispatch]);

  if (checkingAuth) return <Loading />;


  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* Auth Routes */}
          <Route
            path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route
            path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route path="/chat/:toid" element={<Chat />} />

          {/* Parent Route */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}>

            <Route path="search-friends" element={
              <ProtectedRoute><SearchFriends /></ProtectedRoute>} />

            <Route path="friend-requests" element={
              <ProtectedRoute><FriendRequests /></ProtectedRoute>} />

            <Route path="friends" element={
              <ProtectedRoute><Friends /></ProtectedRoute>} />

            <Route path="profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>


        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
