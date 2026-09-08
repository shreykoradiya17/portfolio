/**
 * The honest empty state shared by every device frame.
 *
 * Nothing on this site pretends to be a screenshot it isn't, so a frame with
 * no asset says so and names the capture size it wants. Shared between frames
 * so the two can never drift apart.
 */
export default function FrameSlot({
  label,
  spec,
}: {
  /** Accessible description of what belongs here. */
  label?: string;
  /** The capture size this frame expects, e.g. "1440 × 900". */
  spec: string;
}) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{ background: "var(--paper-2)" }}
      role="img"
      aria-label={label ?? "Screen asset not yet supplied"}
    >
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
        <path d="M0 0 L100 100 M100 0 L0 100" stroke="var(--rule)" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="t-micro dim-2 relative text-center leading-relaxed">
        Asset slot
        <br />
        {spec}
      </span>
    </div>
  );
}
