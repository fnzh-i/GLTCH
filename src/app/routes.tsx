import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Landing from "./components/Landing";
import Schedule from "./components/Schedule";
import TicketWizard from "./components/TicketWizard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "schedule", Component: Schedule },
      { path: "tickets", Component: TicketWizard },
    ],
  },
]);
