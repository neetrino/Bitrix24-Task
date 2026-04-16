import Image from 'next/image';

const LOGO_PATH = '/aibonacci-logo.png' as const;

/** Natural pixel size of `public/aibonacci-logo.png`. */
export const AIBONACCI_LOGO_NATURAL_WIDTH = 512;
export const AIBONACCI_LOGO_NATURAL_HEIGHT = 513;

type SiteLogoImageProps = {
  heightPx: number;
  className?: string;
  priority?: boolean;
};

export function SiteLogoImage({ heightPx, className, priority }: SiteLogoImageProps) {
  const widthPx = Math.round(
    (heightPx * AIBONACCI_LOGO_NATURAL_WIDTH) / AIBONACCI_LOGO_NATURAL_HEIGHT,
  );
  return (
    <Image
      alt="Aibonacci"
      className={className}
      height={heightPx}
      priority={priority}
      src={LOGO_PATH}
      width={widthPx}
    />
  );
}
