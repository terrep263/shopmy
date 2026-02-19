export default function Logo({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <img
      src="/assets/logo.png"
      alt="ShopMyNeighborhood"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}
