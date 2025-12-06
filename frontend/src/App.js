import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import './App.css';
import Loading from "./AppUtils/Loading.tsx";
import Login from "./Pages/Login/Login.tsx";
import PublicRoute from "./AppUtils/PublicRoute.tsx";
import ProtectedRoute from "./AppUtils/ProtectedRoute.tsx";

const SignUp = lazy(() => import("./Pages/Signup/Signup.tsx"));
const Home = lazy(() => import("./Pages/Home/Home.tsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/signup" element={
            <PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
