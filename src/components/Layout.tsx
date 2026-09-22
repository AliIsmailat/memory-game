import { useNavigate, useParams, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CelestialTransition } from "./CelestialTransition";
import { Home } from "../pages/Home";
import { ModePage } from "../pages/ModePage";
import { useTheme } from "../hooks/useTheme";
import { modes } from "../modes";

export function Layout() {
  const navigate = useNavigate();
  const params = useParams<{ modeId: string }>();
  const { theme, toggleTheme } = useTheme();
  const activeModeId = params.modeId ?? null;

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
