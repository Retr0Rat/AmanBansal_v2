export default function CoffeeCup() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginLeft: '6px',
        marginBottom: '2px',
        overflow: 'visible'
      }}
      aria-hidden="true"
    >
      <style>{`
        .steam-a { animation: riseA 2.4s ease-in-out infinite; }
        .steam-b { animation: riseB 2.4s ease-in-out infinite 0.8s; }
        @keyframes riseA {
          0%   { transform: translate(0,0); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translate(-4px,-16px); opacity: 0; }
        }
        @keyframes riseB {
          0%   { transform: translate(0,0); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translate(4px,-16px); opacity: 0; }
        }
      `}</style>

      {/* Steam */}
      <path
        className="steam-a"
        d="M28 18 Q31 12 28 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transformOrigin: '28px 18px' }}
      />
      <path
        className="steam-b"
        d="M46 18 Q43 12 46 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transformOrigin: '46px 18px' }}
      />

      {/* Cup body */}
      <rect
        x="12" y="22" width="52" height="38"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      {/* Cup rim */}
      <ellipse
        cx="38" cy="22" rx="26" ry="5"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />

      {/* Handle */}
      <path
        d="M64 32 Q78 32 78 41 Q78 50 64 50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Saucer */}
      <rect
        x="6" y="60" width="64" height="5"
        rx="2"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  )
}
