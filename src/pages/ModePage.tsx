import { useParams, Navigate } from "react-router-dom";
import { GameRunner } from "../components/GameRunner";
import { modes } from "../modes";

export function ModePage() {
  const { modeId } = useParams<{ modeId: string }>();
  const mode = modes.find((m) => m.id === modeId);

  if (!mode) return <Navigate to="/" replace />;

  return <GameRunner key={mode.id} mode={mode} />;
}
