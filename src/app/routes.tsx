import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Landing from "./components/Landing";
import Schedule from "./components/Schedule";
import Archives from "./components/PreviousEvents";
import TicketPerks from "./components/TicketPerks";
import TicketWizard from "./components/TicketWizard";
import AdminSchedule from "./components/AdminSchedule";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "schedule", Component: Schedule },
      { path: "previous", Component: Archives },
      { path: "tickets", Component: TicketPerks },
      { path: "tickets/configure", Component: TicketWizard },
      { path: "admin", Component: AdminSchedule },
    ],
  },
]);
