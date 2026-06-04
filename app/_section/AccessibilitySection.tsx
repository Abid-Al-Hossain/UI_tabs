"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function AccessibilitySection({ state, update }: Props) {
  return <SectionCard title="Accessibility" subtitle="Accessibility controls for native tabs generation."><Input label="Accessible label" value={state.ariaLabel} onChange={(value) => update("ariaLabel", value)} /></SectionCard>;
}
