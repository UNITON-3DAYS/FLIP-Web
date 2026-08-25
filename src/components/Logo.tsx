export default function Logo({ className = 'text-3xl' }: { className?: string }) {
  return <span className={`font-logo font-black text-primary-300 ${className}`}>Checkit</span>
}
