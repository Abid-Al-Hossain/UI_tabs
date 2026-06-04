"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function RadiusSection({ state, update }: Props) {
  return <SectionCard title="Radius" subtitle="Radius controls for native tabs generation."><Slider label="Radius" value={state.radius} min={0} max={56} step={1} onChange={(value) => update("radius", value)} /></SectionCard>;
}
