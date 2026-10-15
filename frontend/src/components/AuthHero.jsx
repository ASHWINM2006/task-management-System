/**
 * AuthHero.jsx
 * The right-hand purple hero panel with vector customer-support character,
 * computer monitor, floating tech doodles, AI brain icon, and ambient accents.
 * Matches the reference image style.
 */
export default function AuthHero() {
  return (
    <div className="auth-hero-panel">
      {/* Top right AI brain badge */}
      <div className="auth-hero-badge-top" title="AI Powered">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      </div>

      {/* Bottom right magic sparkles badge */}
      <div className="auth-hero-badge-bottom" title="Smart Features">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
          <path d="M5 3v4" /><path d="M3 5h4" />
        </svg>
      </div>

      {/* Main Vector Art Canvas */}
      <svg
        className="auth-hero-art"
        viewBox="0 0 540 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="charTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#63459c" />
            <stop offset="100%" stopColor="#53338e" />
          </linearGradient>
          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* ── Background Doodles & Floating Icons ── */}
        <g stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Info bubble (top left) */}
          <rect x="70" y="60" width="46" height="46" rx="10" />
          <path d="M93 106 L84 116 L90 106" fill="rgba(255,255,255,0.32)" />
          <line x1="93" y1="78" x2="93" y2="92" strokeWidth="2" />
          <circle cx="93" cy="71" r="1.5" fill="rgba(255,255,255,0.4)" stroke="none" />

          {/* Headset (top center) */}
          <path d="M210 88 A 24 24 0 0 1 258 88" strokeWidth="2" />
          <rect x="204" y="86" width="7" height="15" rx="3.5" fill="rgba(255,255,255,0.2)" />
          <rect x="257" y="86" width="7" height="15" rx="3.5" fill="rgba(255,255,255,0.2)" />

          {/* Chat bubble (top right) */}
          <rect x="420" y="80" width="46" height="34" rx="17" />
          <circle cx="433" cy="97" r="1.8" fill="rgba(255,255,255,0.4)" stroke="none" />
          <circle cx="443" cy="97" r="1.8" fill="rgba(255,255,255,0.4)" stroke="none" />
          <circle cx="453" cy="97" r="1.8" fill="rgba(255,255,255,0.4)" stroke="none" />

          {/* Globe with 24 (mid left) */}
          <circle cx="90" cy="190" r="30" />
          <ellipse cx="90" cy="190" rx="15" ry="30" />
          <line x1="60" y1="190" x2="120" y2="190" />
          <circle cx="106" cy="204" r="12" fill="#8e6ecf" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
          <text x="99" y="208" fill="rgba(255,255,255,0.7)" fontSize="10" fontWeight="700" fontFamily="sans-serif" stroke="none">24</text>

          {/* Smartphone with user (center upper) */}
          <rect x="225" y="145" width="34" height="54" rx="6" />
          <line x1="237" y1="151" x2="247" y2="151" />
          <circle cx="242" cy="166" r="6" />
          <path d="M233 183 C233 175, 251 175, 251 183" />

          {/* Laptop with phone handset (right upper) */}
          <rect x="335" y="145" width="56" height="40" rx="4" />
          <line x1="324" y1="185" x2="402" y2="185" strokeWidth="2.5" />
          <path d="M354 163 Q 363 154, 372 163" strokeWidth="2" />

          {/* Envelope (left lower) */}
          <rect x="95" y="275" width="52" height="36" rx="4" />
          <path d="M95 277 L121 297 L147 277" />

          {/* Question mark & Hand icon */}
          <path d="M410 185 Q 416 175, 424 182 Q 418 191, 418 196" strokeWidth="2" />
          <circle cx="418" cy="204" r="1.5" fill="rgba(255,255,255,0.4)" stroke="none" />
          <path d="M420 226 C415 233, 400 236, 395 244 L435 244" />

          {/* Ambient Crosses & Little Dots */}
          <path d="M140 100 L148 100 M144 96 L144 104" />
          <path d="M330 95 L338 95 M334 91 L334 99" />
          <path d="M465 145 L473 145 M469 141 L469 149" />
          <path d="M190 220 L198 220 M194 216 L194 224" />
          <path d="M340 230 L348 230 M344 226 L344 234" />
          <circle cx="160" cy="140" r="2" fill="rgba(255,255,255,0.25)" stroke="none" />
          <circle cx="300" cy="120" r="2" fill="rgba(255,255,255,0.25)" stroke="none" />
          <circle cx="400" cy="125" r="2" fill="rgba(255,255,255,0.25)" stroke="none" />
          <circle cx="180" cy="180" r="3" />
          <circle cx="310" cy="210" r="3" />
        </g>

        {/* ── Left Checkmark Pill Badge ── */}
        <g filter="url(#badgeShadow)">
          <rect x="75" y="340" width="76" height="42" rx="21" fill="rgba(255,255,255,0.25)" stroke="#ffffff" strokeWidth="2" />
          <circle cx="96" cy="361" r="15" fill="#ffffff" />
          <path d="M89 361 L94 366 L103 356" stroke="#6d28d9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Monitor Stand ── */}
        <path d="M245 540 L245 490 L295 490 L295 540 Z" fill="#eae1fa" />
        <path d="M195 540 Q 270 545, 345 540 L345 545 Q 270 550, 195 545 Z" fill="#eae1fa" />

        {/* ── Computer Monitor Bezel & Screen ── */}
        <rect x="150" y="320" width="240" height="175" rx="16" fill="#181324" stroke="#ffffff" strokeWidth="3" />

        {/* ── Character Art Emerging From Monitor ── */}
        <g>
          {/* Purple Top / Blouse */}
          <path
            d="M175 495 C178 415, 195 385, 235 375 L255 375 C295 385, 312 415, 315 495 Z"
            fill="url(#charTopGrad)"
          />
          {/* Inner collar */}
          <ellipse cx="245" cy="382" rx="20" ry="12" fill="#ffffff" />

          {/* Neck */}
          <rect x="238" y="345" width="14" height="26" fill="#ffffff" />

          {/* Head & Face */}
          <ellipse cx="245" cy="320" rx="24" ry="26" fill="#ffffff" />

          {/* Sleek Black Hair */}
          <path
            d="M216 325 C210 278, 280 274, 274 325 C284 355, 276 385, 270 380 C265 345, 225 345, 220 380 C214 385, 206 355, 216 325 Z"
            fill="#120e1f"
          />

          {/* Headset over hair */}
          <path d="M228 318 C228 296, 262 296, 262 318" stroke="#31224d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="227" cy="320" r="5" fill="#31224d" />
          <circle cx="263" cy="320" r="5" fill="#31224d" />
          {/* Microphone boom */}
          <path d="M263 322 Q 256 340, 246 338" stroke="#31224d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="245" cy="338" r="3" fill="#a855f7" />

          {/* Face Features (minimalist stylized) */}
          <circle cx="238" cy="321" r="2.2" fill="#120e1f" />
          <circle cx="252" cy="321" r="2.2" fill="#120e1f" />
          <path d="M241 330 Q 245 334, 249 330" stroke="#120e1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* ── Left Arm & Hand with OK Gesture (👌) ── */}
          {/* Arm going up */}
          <path
            d="M178 450 C165 410, 160 360, 175 335 L190 342 C178 365, 180 415, 192 450 Z"
            fill="#ffffff"
          />
          {/* Hand forming the circle: Thumb and index touching */}
          <ellipse cx="185" cy="325" rx="13" ry="13" fill="#ffffff" />
          <ellipse cx="185" cy="325" rx="5" ry="5" fill="#181324" />
          {/* Upright fingers (middle, ring, pinky) */}
          <path
            d="M170 328 L170 292 C170 288, 175 288, 175 292 L175 320
               M177 318 L177 286 C177 282, 182 282, 182 286 L182 318
               M184 318 L184 290 C184 286, 189 286, 189 290 L189 320"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ── Ambient Sine Waves & Accents ── */}
        <g stroke="rgba(255,255,255,0.6)" strokeWidth="2.2" strokeLinecap="round" fill="none">
          {/* Left wave */}
          <path d="M80 445 Q 92 433, 105 445 T 130 445" />
          {/* Right wave */}
          <path d="M410 440 Q 422 428, 435 440 T 460 440" />
          {/* Under base wave */}
          <path d="M375 528 Q 387 516, 400 528 T 425 528" />
        </g>

        {/* Right concentric signal circles */}
        <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" fill="none">
          <circle cx="410" cy="335" r="12" />
          <circle cx="428" cy="335" r="8" />
          <circle cx="440" cy="335" r="5" />
        </g>

        {/* Ground horizontal line */}
        <line x1="130" y1="545" x2="440" y2="545" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

