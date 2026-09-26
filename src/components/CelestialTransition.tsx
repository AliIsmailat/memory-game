import { useState } from "react";
import { SunburstIcon, MoonIcon, SunFace, MoonFace } from "./icons/theme";
const CURVE_PATH = "M 390 300 C 390 490 520 530 760 580";

export function CelestialTransition({ theme }: { theme: "light" | "dark" }) {
  const sunDistance = theme === "dark" ? "100%" : "0%";
  const moonDistance = theme === "dark" ? "0%" : "100%";
  const [sunAngry, setSunAngry] = useState(false);
  const [moonAngry, setMoonAngry] = useState(false);

  function pokeSun() {
    if (sunAngry) return;
    setSunAngry(true);
    setTimeout(() => setSunAngry(false), 3000);
  }

  function pokeMoon() {
    if (moonAngry) return;
    setMoonAngry(true);
    setTimeout(() => setMoonAngry(false), 3000);
  }

  return (
    <div className="hidden md:block fixed -top-25 -right-15 w-140 h-177.5 overflow-hidden pointer-events-none z-40">
      <div
        className="absolute"
        style={{
          offsetPath: `path('${CURVE_PATH}')`,
          offsetDistance: sunDistance,
          offsetRotate: "0deg",
          transition: "offset-distance 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          onClick={pokeSun}
          className={`relative pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-125 ${sunAngry ? "animate-angry-shake" : ""}`}
          style={{
            filter:
              "drop-shadow(0 0 35px rgba(201,138,46,0.75)) drop-shadow(0 0 70px rgba(201,138,46,0.5))",
          }}
        >
          <SunburstIcon size={130} />
          <div className="absolute inset-0 flex items-start justify-center pt-8 transition-opacity duration-200">
            <SunFace size={55} angry={sunAngry} color="#5F3A0F" />
          </div>
        </div>
      </div>

      <div
        className="absolute"
        style={{
          offsetPath: `path('${CURVE_PATH}')`,
          offsetDistance: moonDistance,
          offsetRotate: "0deg",
          transition: "offset-distance 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          onClick={pokeMoon}
          className={`relative pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-125 ${moonAngry ? "animate-angry-shake" : ""}`}
          style={{
            filter:
              "drop-shadow(0 0 30px rgba(215,219,232,0.75)) drop-shadow(0 0 65px rgba(215,219,232,0.5))",
          }}
        >
          <MoonIcon size={130} color="#D7DBE8" />
          <div className="absolute inset-0 flex items-start justify-center pt-8 pr-9 transition-opacity duration-200">
            <MoonFace
              size={55}
              angry={moonAngry}
              color="#000000"
              className="-rotate-18"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
