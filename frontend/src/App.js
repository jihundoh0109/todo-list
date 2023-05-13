import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { checkAuthAndRedirect } from "./util/auth";

import Root from "./pages/Root";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <Home />,
          loader: () => checkAuthAndRedirect("unprotected"),
        },
        {
          path: "/login",
          element: <Login />,
          loader: () => checkAuthAndRedirect("unprotected"),
        },
        {
          path: "/signup",
          element: <Signup />,
          loader: () => checkAuthAndRedirect("unprotected"),
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
          loader: () => checkAuthAndRedirect("protected"),
        },
        {
          path: "/account",
          element: <Account />,
          loader: () => checkAuthAndRedirect("protected")
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;