import AllWorks from "./pages/AllWorks";
import NewWork from "./pages/NewWork";
import PassWork from "./pages/PassWork";
import Settings from "./pages/Settings";

export const routes = [
    {
        path: '/',
        Component: AllWorks
    },
    {
        path: '/works',
        Component: AllWorks
    },
    {
        path: '/work/:id',
        Component: PassWork
    },
    {
        path: '/new',
        Component: NewWork
    },
    {
        path: '/settings',
        Component: Settings
    }
]