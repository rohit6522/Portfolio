import { availability } from '../data/content'

export default function AvailabilityBadge() {
  if (!availability?.open) return null

  return (
    <span className="availability-badge">
      <span className="availability-dot" aria-hidden="true" />
      {availability.text}
    </span>
  )
}