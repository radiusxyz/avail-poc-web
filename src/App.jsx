import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import BlockTxs from "./pages/BlockTxs";
import RootLayout from "./pages/RootLayout";
import Bridge from "./pfa/screens/Bridge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: "/",
        element: <Bridge />,
        loader: () => {
          window.scrollTo(0, 0);
          return null;
        },
      },
      {
        path: "user/:address",
        element: <BlockTxs />,
        loader: () => {
          window.scrollTo(0, 0);
          return null;
        },
      },
      {
        path: "block/:height",
        element: <BlockTxs />,
        loader: () => {
          window.scrollTo(0, 0);
          return null;
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
