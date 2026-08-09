interface Props {
  size?: number;
  className?: string;
  variant?: "gold" | "mono";
}

export function KawnLogo({ size = 64, className = "", variant = "gold" }: Props) {
  const gold = "#F2C94C";
  const dark = variant === "gold" ? "#0F3D2E" : "currentColor";
  const handColor = variant === "gold" ? gold : "currentColor";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="كون"
    >
      {/* Heart on top */}
      <path
        d="M32 14c-1.6-3-4.4-4.6-7.4-4.6-4.4 0-7.6 3.4-7.6 7.8 0 6 7 9.8 15 15.4 8-5.6 15-9.4 15-15.4 0-4.4-3.2-7.8-7.6-7.8-3 0-5.8 1.6-7.4 4.6z"
        fill={dark}
        opacity="0.95"
      />
      {/* Cupped hands */}
      <path
        d="M14 36c0-2 1.6-3.6 3.6-3.6 1.4 0 2.6.8 3.2 2l4.4 8.8c.4.8 1.2 1.2 2 1.2h9.6c.8 0 1.6-.4 2-1.2l4.4-8.8c.6-1.2 1.8-2 3.2-2 2 0 3.6 1.6 3.6 3.6v3c0 8.8-7.2 16-16 16h-4c-8.8 0-16-7.2-16-16v-3z"
        fill={handColor}
      />
      <path
        d="M22 44c0-3 2.4-5.4 5.4-5.4h9.2c3 0 5.4 2.4 5.4 5.4v2c0 4.4-3.6 8-8 8h-4c-4.4 0-8-3.6-8-8v-2z"
        fill={dark}
        opacity="0.15"
      />
    </svg>
  );
}
