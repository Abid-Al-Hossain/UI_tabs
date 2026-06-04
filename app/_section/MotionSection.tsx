"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Switch from "@/components/shared/input/Switch";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function MotionSection({ state, update }: Props) {
  return <SectionCard title="Motion" subtitle="Motion controls for native tabs generation."><Switch label="Motion safe" checked={state.motion} onChange={(value) => update("motion", value)} /></SectionCard>;
}
