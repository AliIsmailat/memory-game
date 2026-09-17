import { SunIcon, MoonIcon } from "./icons";
const CURVE_PATH = "M 390 300 C 390 490 520 530 760 580";

export function CelestialTransition({ theme }: { theme: "light" | "dark" }) {
  const sunDistance = theme === "dark" ? "100%" : "0%";
  const moonDistance = theme === "dark" ? "0%" : "100%";

  return (
    <div className="fixed -top-20 right-0 w-140 h-177.5 overflow-hidden pointer-events-none -z-10">
      {" "}
      <div
        className="absolute"
        style={{
          offsetPath: `path('${CURVE_PATH}')`,
          offsetDistance: sunDistance,
          offsetRotate: "0deg",
          transition: "offset-distance 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          filter:
            "drop-shadow(0 0 35px rgba(201,138,46,0.75)) drop-shadow(0 0 70px rgba(201,138,46,0.5))",
        }}
      >
        <SunIcon size={150} color="#C98A2E" />
      </div>
      <div
        className="absolute"
        style={{
          offsetPath: `path('${CURVE_PATH}')`,
          offsetDistance: moonDistance,
          offsetRotate: "0deg",
          transition: "offset-distance 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          filter:
            "drop-shadow(0 0 30px rgba(215,219,232,0.75)) drop-shadow(0 0 65px rgba(215,219,232,0.5))",
        }}
      >
        <MoonIcon size={160} color="#D7DBE8" />
      </div>
    </div>
  );
}
