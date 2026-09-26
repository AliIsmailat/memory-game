import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CelestialTransition } from "./CelestialTransition";
import { Home } from "../pages/Home";
import { ModePage } from "../pages/ModePage";
import { useTheme } from "../hooks/useTheme";
import { modes } from "../modes";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  // Layout itself isn't rendered by a parameterized <Route>, so useParams()
  // here would always be empty (it only sees params from the *nearest*
  // enclosing Route, and the /:modeId Route is defined further down, inside
  // this very component). Reading the path directly works regardless of
  // where in the tree we are.
  const activeModeId =
    location.pathname === "/" ? null : location.pathname.slice(1);

  return (
    <div className="min-h-screen flex flex-col relative">
      <CelestialTransition theme={theme} />
      <Navbar
        modes={modes}
        activeModeId={activeModeId}
        onSelectMode={(id) => navigate(`/${id}`)}
        onGoHome={() => navigate("/")}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home modes={modes} onSelectMode={(id) => navigate(`/${id}`)} />
            }
          />
          <Route path="/:modeId" element={<ModePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
