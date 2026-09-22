export function PlayIcon({
  size = 24,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-3 0 28 28"
      fill="none"
      className={className}
    >
      <path
        fill={color}
        d="M440.415,583.554 L421.418,571.311 C420.291,570.704 419,570.767 419,572.946 L419,597.054 C419,599.046 420.385,599.36 421.418,598.689 L440.415,586.446 C441.197,585.647 441.197,584.353 440.415,583.554"
        transform="translate(-419, -571)"
      />
    </svg>
  );
}

export function ConstellationIcon({ size = 25 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 30" fill="none">
      <path
        d="M4,26 L14,10 L20,20 L28,6 L34,14"
        stroke="#1B1500"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 4"
        className="group-hover:animate-[dash-flow_1.2s_linear_infinite]"
      />
      {[
        [4, 26],
        [14, 10],
        [20, 20],
        [28, 6],
        [34, 14],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="2.2"
          fill="#1B1500"
          className="group-hover:animate-[twinkle_1s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </svg>
  );
}

export function CompositionIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        className="composition-tl"
        d="M6 3V10.5V14C6 15.8856 6 16.8284 6.58579 17.4142C7.17157 18 8.11438 18 10 18H13.5H21"
        stroke="#12202E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="composition-br"
        d="M18 21L18 13.5L18 10C18 8.11438 18 7.17157 17.4142 6.58579C16.8284 6 15.8856 6 14 6L10.5 6L3 6"
        stroke="#12202E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PoseIcon({ size = 37 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 400" fill="none">
      <circle cx="150" cy="108" r="27" stroke="#2B0E0E" strokeWidth="15" />
      <line
        x1="150"
        y1="140"
        x2="150"
        y2="262"
        stroke="#2B0E0E"
        strokeWidth="15"
        strokeLinecap="round"
      />

      <g className="pose-r-shoulder" style={{ transformOrigin: "178px 150px" }}>
        <line
          x1="178"
          y1="150"
          x2="218"
          y2="184.2"
          stroke="#2B0E0E"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <g
          className="pose-r-elbow"
          style={{ transformOrigin: "218px 184.2px" }}
        >
          <line
            x1="218"
            y1="184.2"
            x2="252.2"
            y2="219.9"
            stroke="#2B0E0E"
            strokeWidth="15"
            strokeLinecap="round"
          />
        </g>
      </g>

      <g className="pose-l-shoulder" style={{ transformOrigin: "122px 150px" }}>
        <line
          x1="122"
          y1="150"
          x2="122"
          y2="208"
          stroke="#2B0E0E"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <g className="pose-l-elbow" style={{ transformOrigin: "122px 208px" }}>
          <line
            x1="122"
            y1="208"
            x2="122"
            y2="260"
            stroke="#2B0E0E"
            strokeWidth="15"
            strokeLinecap="round"
          />
        </g>
      </g>

      <g className="pose-r-hip" style={{ transformOrigin: "168px 258px" }}>
        <line
          x1="168"
          y1="258"
          x2="168"
          y2="368"
          stroke="#2B0E0E"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </g>

      <g className="pose-l-hip" style={{ transformOrigin: "132px 258px" }}>
        <line
          x1="132"
          y1="258"
          x2="132"
          y2="368"
          stroke="#2B0E0E"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function PenIcon({
  size = 20,
  color = "#0E2314",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="-8.98 0 217.7 217.7" fill={color}>
      <path d="M189,28.07c2.26,2.47,4,4.41,5.74,6.26,5.44,5.63,6.28,12.28,3.15,19a221.61,221.61,0,0,1-12.16,22.69C178.57,87.77,171,99.25,162,109.73c-1.83,2.13-3.81,4.15-5.74,6.25-3.59-1.26-5.81-3.49-8-5.64s-2.91-5-1.26-7.82c2.17-3.7,4.42-7.37,6.9-10.87,6.46-9.11,13.25-18,19.53-27.21,3.37-4.95,6-10.39,8.89-15.66.63-1.17,1.13-2.63-1.06-3.93-.65.94-1.3,1.77-1.81,2.67-8.13,14.18-16.48,28.18-27.8,40.19-4.5,4.79-8.45,10.11-12.57,15.25a32.1,32.1,0,0,0-2.13,3.66c-.55.9-1.07,2.4-1.8,2.53-3.25.58-4.6,3.27-6.45,5.34-7.46,8.33-14.8,16.75-22.24,25.09A214.24,214.24,0,0,1,64.57,176.3C56.46,181.65,49,187.91,41,193.45c-8.49,5.88-16.53,12.16-23.61,19.77-4.77,5.12-9.39,5.55-14.72,2.83-2.39-1.22-3.06-3-2.37-5.7,1.24-4.93,4.29-8.8,7.76-12.18s5.22-7.2,6.49-11.72a56.7,56.7,0,0,1,5.25-12.65c7.63-13.45,15.2-27,23.48-40C54.79,115.58,68.78,99.26,83.9,83.91c1.61-1.63,3.19-3.3,4.85-4.88a5.83,5.83,0,0,0,2.13-5.33,7.57,7.57,0,0,1,2.18-6.3c8.38-9.4,15.43-20,24.84-28.48,12.35-11.13,24.78-22.2,39.25-30.58A138.15,138.15,0,0,1,172.58.84c5.29-2.24,14.41.21,18,4.74a9.34,9.34,0,0,1,2,5.46,67.2,67.2,0,0,1-1.43,11A42.38,42.38,0,0,1,189,28.07Z" />
    </svg>
  );
}

export function GestureIcon({ size = 20 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-200">
        <PenIcon size={size * 0.85} />
      </div>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 60"
        fill="none"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <path
          className="gesture-stroke"
          d="M4,40 C18,10 28,45 40,20 C50,2 60,38 70,15 C78,0 86,28 94,18"
          stroke="#0E2314"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
