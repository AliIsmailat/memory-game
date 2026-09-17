import { useEffect, useState } from "react";
import { GameRunner } from "./components/GameRunner";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CelestialTransition } from "./components/CelestialTransition";
import { useTheme } from "./hooks/useTheme";
import { modes } from "./modes";

const STORAGE_KEY = "lastModeId";

function App() {
  const [modeId, setModeId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return modes.some((m) => m.id === saved) ? saved! : modes[0].id;
  });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, modeId);
  }, [modeId]);

  const mode = modes.find((m) => m.id === modeId)!;

  return (
    <div className="min-h-screen flex flex-col relative">
      <CelestialTransition theme={theme} />
      <Navbar
        modes={modes}
        activeModeId={modeId}
        onSelectMode={setModeId}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="flex-1">
        <GameRunner key={mode.id} mode={mode} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
