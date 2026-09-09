import type { ElementType } from "react";

/**
 * The project's name plate.
 *
 * Shared by the transition overlay and the project page's hero so the two are
 * guaranteed identical rather than merely similar. The overlay cross-fades to
 * the real page underneath, and because this markup is the same in both, the
 * title appears to stay put while the world behind it changes.
 *
 * Must be rendered inside a `.on-ink` container and a `.grid-page` row.
 */
export default function NamePlate({
  index,
  name,
  category,
  as = "span",
}: {
  index: string;
  name: string;
  category?: string;
  as?: ElementType;
}) {
  const Title = as;
  return (
    <div className="col-span-12 flex items-end justify-between gap-6">
      <div className="min-w-0">
        <span className="t-meta acc tnum block">{index}</span>
        <Title className="t-display m-0 mt-2 block">{name}</Title>
      </div>
      {category ? (
        <span className="t-meta dim hidden shrink-0 pb-2 lg:block">{category}</span>
      ) : null}
    </div>
  );
}
