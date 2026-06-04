"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function LayoutSection({ state, update }: Props) {
  return <SectionCard title="Layout" subtitle="Layout controls for native tabs generation."><Select label="Orientation" value={state.orientation} options={[
  "horizontal",
  "vertical"
]} onChange={(value) => update("orientation", value)} /></SectionCard>;
}
