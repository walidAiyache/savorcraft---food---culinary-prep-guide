import React, { useEffect } from 'react';

interface GoogleAdSlotProps {
    slot: string | undefined;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({ slot, className = '' }) => {
    const client = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
    const isConfigured = Boolean(client && slot);

    useEffect(() => {
        if (!isConfigured || !client) return;

        const existingScript = document.querySelector('script[data-adsense-script]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.async = true;
            // script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
            script.crossOrigin = 'anonymous';
            script.dataset.adsenseScript = 'true';
            document.head.appendChild(script);
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
            // AdSense may not be available when ad blockers or network policies block it.
        }
    }, [client, isConfigured, slot]);

    return (
        <section aria-label="Advertisement" className={`w-full ${className}`}>
            {isConfigured ? (
                <ins
                    className="adsbygoogle block min-h-[90px]"
                    style={{ display: 'block' }}
                    data-ad-client={client}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            ) : (
                <div className="flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-[#ded5c8] bg-[#fdfbf8] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a09285]">
                    Advertisement space
                </div>
            )}
        </section>
    );
};