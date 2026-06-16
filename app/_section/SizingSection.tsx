"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import { SegmentedControl } from "@/components/shared/input/SegmentedControl";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function SizingSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Sizing" subtitle="Sizing controls for native tabs generation.">
      <div className="space-y-4">
        <Slider label="Width" value={state.width} min={220} max={900} step={1} onChange={(value) => update("width", value)} />
        <Slider label="Height" value={state.height} min={120} max={720} step={1} onChange={(value) => update("height", value)} />
        <Slider label="Gap" value={state.gap} min={0} max={48} step={1} onChange={(value) => update("gap", value)} />
        <Slider label="Padding" value={state.padding} min={8} max={64} step={1} onChange={(value) => update("padding", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Tab geometry" subtitle="Tab spacing, padding, radius, and indicator.">
      <div className="space-y-4">
        <Slider label="Tab gap" value={state.tabGap} min={0} max={24} step={1} onChange={(value) => update("tabGap", value)} />
        <Slider label="Tab padding X" value={state.tabPaddingX} min={4} max={32} step={1} onChange={(value) => update("tabPaddingX", value)} />
        <Slider label="Tab padding Y" value={state.tabPaddingY} min={4} max={28} step={1} onChange={(value) => update("tabPaddingY", value)} />
        <Slider label="Tab radius" value={state.tabRadius} min={0} max={28} step={1} onChange={(value) => update("tabRadius", value)} />
        <Slider label="Indicator height" value={state.indicatorHeight} min={1} max={8} step={1} onChange={(value) => update("indicatorHeight", value)} />
        <Slider label="Indicator radius" value={state.indicatorRadius} min={0} max={999} step={1} onChange={(value) => update("indicatorRadius", value)} />
        <Slider label="Icon size" value={state.iconSize} min={8} max={22} step={1} onChange={(value) => update("iconSize", value)} />
        <Slider label="Badge radius" value={state.badgeRadius} min={0} max={999} step={1} onChange={(value) => update("badgeRadius", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Panel & overflow" subtitle="Panel sizing and tab overflow behavior.">
      <div className="space-y-4">
        <Slider label="Panel padding" value={state.panelPadding} min={4} max={40} step={1} onChange={(value) => update("panelPadding", value)} />
        <Slider label="Panel radius" value={state.panelRadius} min={0} max={32} step={1} onChange={(value) => update("panelRadius", value)} />
        <SegmentedControl
          label="Overflow"
          value={state.overflowMode}
          options={[{ label: "Wrap", value: "wrap" }, { label: "Scroll", value: "scroll" }, { label: "Dropdown", value: "dropdown" }]}
          onChange={(value) => update("overflowMode", value as TabsState["overflowMode"])}
        />
        <SegmentedControl
          label="Icon position"
          value={state.iconPosition}
          options={[{ label: "Left", value: "left" }, { label: "Right", value: "right" }]}
          onChange={(value) => update("iconPosition", value as TabsState["iconPosition"])}
        />
        <Switch label="Closable tabs" checked={state.closableTabs} onChange={(value) => update("closableTabs", value)} />
      </div>
    </SectionCard>
    </div>
  );
}
