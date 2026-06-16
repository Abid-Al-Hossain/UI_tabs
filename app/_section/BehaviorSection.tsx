"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Select from "@/components/shared/input/Select";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Activation" subtitle="Tab activation mode and indicator style.">
      <div className="space-y-4">
        <Select label="Activation" value={state.activationMode} options={["automatic", "manual"]} onChange={(value) => update("activationMode", value)} />
        <Select label="Indicator" value={state.indicator} options={["pill", "underline"]} onChange={(value) => update("indicator", value)} />
      </div>
    </SectionCard>
      <SectionCard title="State" subtitle="Disabled tabs count and component state.">
      <div className="space-y-4">
        <Slider label="Disabled items" value={state.disabledItems} min={0} max={5} step={1} onChange={(value) => update("disabledItems", value)} />
        <Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} />
      </div>
    </SectionCard>
    </div>
  );
}
