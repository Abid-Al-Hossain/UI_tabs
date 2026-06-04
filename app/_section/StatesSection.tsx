"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Select from "@/components/shared/input/Select";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function StatesSection({ state, update }: Props) {
  return <SectionCard title="State Preview" subtitle="State Preview controls for native tabs generation."><Select label="Preview state" value={state.previewState} options={[
  "default",
  "hover",
  "focus",
  "active",
  "open",
  "closed",
  "selected",
  "loading",
  "empty",
  "error",
  "success"
]} onChange={(value) => update("previewState", value)} />
<Slider label="Active index" value={state.activeIndex} min={0} max={12} step={1} onChange={(value) => update("activeIndex", value)} /></SectionCard>;
}
