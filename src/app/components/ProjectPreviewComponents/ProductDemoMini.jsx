// components/mini-demos/ProductDemoMini.tsx
'use client';

import FloatingCard from '../../components/mini-demos/ProductVariants/FloatingCard';
import PhoneModel from '../../components/mini-demos/ProductVariants/PhoneModel';
import HtmlOverlay from '../../components/mini-demos/ProductVariants/HtmlOverlay';
import GsapUnbox from '../../components/mini-demos/ProductVariants/GsapUnbox';

// Random demo (or switch based on props)
const demos = [FloatingCard, PhoneModel, HtmlOverlay, GsapUnbox];
const randomDemo = demos[Math.floor(Math.random() * demos.length)];

export default function ProductDemoMini() {
  const Component = PhoneModel;
  return <Component />;
}
