"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return <SectionCard title="Behavior" subtitle="Behavior controls for native tabs generation."><Select label="Activation" value={state.activationMode} options={[
  "automatic",
  "manual"
]} onChange={(value) => update("activationMode", value)} />
<Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} /></SectionCard>;
}
