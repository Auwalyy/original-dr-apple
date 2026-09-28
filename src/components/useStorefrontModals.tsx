import React, { useState } from 'react';

import { useCMS } from '@/lib/store';
import { Product } from '@/lib/types';

import { QuickViewModal } from './QuickViewModal';
import { SwapCalculatorModal } from './SwapCalculatorModal';

/** Swap calculator + quick view state shared by the home and category screens. */
export function useStorefrontModals() {
  const { products, settings } = useCMS();
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState<Product | null>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const openSwap = (product: Product | null = null) => {
    setSwapTarget(product);
    setIsSwapOpen(true);
  };

  const modals = (
    <>
      <SwapCalculatorModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        products={products}
        selectedTargetProduct={swapTarget}
        whatsappPhone={settings.contact_whatsapp}
      />
      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onOpenSwap={(p) => openSwap(p)}
        whatsappPhone={settings.contact_whatsapp}
      />
    </>
  );

  return { openSwap, openQuickView: setQuickView, modals };
}
