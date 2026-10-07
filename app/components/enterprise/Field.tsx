'use client';

import Image from 'next/image';

/**
 * A blurred, out-of-focus light plate that sits *behind* content.
 *
 * These are greyscale PNGs composited with `screen`, so pure black in the
 * source contributes nothing and only the luminous mass shows against the
 * page. Purely decorative — never carries meaning, always aria-hidden.
 */
export type FieldName = 'beam-a' | 'beam-b' | 'haze-a' | 'haze-b' | 'lattice';

export default function Field({
  name,
  className = '',
  opacity = 0.5,
  priority = false,
}: {
  name: FieldName;
  className?: string;
  /** Peak strength of the plate. Keep low so text always wins. */
  opacity?: number;
  priority?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ opacity, mixBlendMode: 'multiply' }}
    >
      <Image
        src={`/images/field/${name}.png`}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
