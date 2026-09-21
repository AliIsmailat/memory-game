import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CelestialTransition } from "./components/CelestialTransition";
import { Home } from "./pages/Home";
import { ModePage } from "./pages/ModePage";
import { useTheme } from "./hooks/useTheme";
import { modes } from "./modes";

function Layout() {
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

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
