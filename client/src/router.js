import { createBrowserRouter } from "react-router-dom";
import Start from "./components/Start";
import Chat from "./components/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

export default router;
