import Image from 'next/image';
import Field, { type FieldName } from './Field';
import { Eyebrow } from './primitives';

/** Masthead shared by the dedicated inner pages. */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  field = 'beam-b',
  image,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede: string;
  field?: FieldName | null;
  image?: { src: string; alt: string };
}) {
  return (
    <header className="lp-masthead lp-intro relative overflow-hidden pt-[72px]">
      {!image && <div className="m3-blueprint absolute inset-0" aria-hidden="true" />}
      <div className="m3-rails" aria-hidden="true" />
      {field && (
        <Field name={field} className="lp-masthead-field inset-y-0 right-[-20%] w-[80%]" opacity={0.34} priority />
      )}

      <div className={`m3-shell relative z-[1] pb-12 pt-12 sm:pb-20 sm:pt-24 ${image ? 'grid items-center gap-10 lg:grid-cols-2 lg:gap-12 lg:py-20' : 'lg:pb-28 lg:pt-32'}`}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h1 className={`lp-masthead-title m3-display ${eyebrow ? 'mt-8' : ''} ${image ? 'text-[clamp(2.25rem,4vw,3.75rem)]' : 'max-w-[900px] text-[clamp(2.25rem,5.6vw,4.25rem)]'} text-black`}>
            {title}
          </h1>

          <p className="lp-masthead-lede m3-lede mt-8 max-w-[560px] text-[15px]">{lede}</p>
        </div>

        {image && (
          <div className="lp-masthead-image relative aspect-[4/3] w-full overflow-hidden bg-white">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 50vw, 650px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}
