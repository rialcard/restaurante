export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }
  return (
    <span className={`icon animate-spin text-secondary-container ${sizes[size]} ${className}`}>
      progress_activity
    </span>
  )
}
