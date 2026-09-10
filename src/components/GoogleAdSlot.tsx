import React, { useEffect, useRef } from 'react';

interface GoogleAdSlotProps {
  slot?: string;
  className?: string;
  format?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slot,
  className = '',
  format = 'auto',
  responsive = true,
}) => {
  const initializedRef = useRef(false);
  const publisherId = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!slot || !publisherId || initializedRef.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch {
      // AdSense can throw in development, with ad blockers, or before its script loads.
      // Ads are non-critical, so fail silently instead of breaking the app.
    }
  }, [slot, publisherId]);

  if (!slot || !publisherId) {
    return null;
  }

  return (
    <div className={className} aria-hidden="true">
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
