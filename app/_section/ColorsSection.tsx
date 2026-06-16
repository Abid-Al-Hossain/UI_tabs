"use client";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import ColorControl from "@/components/shared/color/ColorControl";
import type { TabsState } from "../types";

type Props = { state: TabsState; update: <K extends keyof TabsState>(key: K, value: TabsState[K]) => void };

export default function ColorsSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Shell" subtitle="Outer container colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.background} onChange={(v) => update("background", v)} />
        <ColorControl label="Foreground" value={state.foreground} onChange={(v) => update("foreground", v)} />
        <ColorControl label="Accent" value={state.accent} onChange={(v) => update("accent", v)} />
        <ColorControl label="Muted" value={state.muted} onChange={(v) => update("muted", v)} />
        <ColorControl label="Border" value={state.border} onChange={(v) => update("border", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Active Tab" subtitle="Selected tab button colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.activeTabBg} onChange={(v) => update("activeTabBg", v)} />
        <ColorControl label="Text" value={state.activeTabText} onChange={(v) => update("activeTabText", v)} />
        <ColorControl label="Border" value={state.activeTabBorder} onChange={(v) => update("activeTabBorder", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Inactive Tab" subtitle="Non-selected tab button colors.">
      <div className="space-y-4">
        <ColorControl label="Text" value={state.inactiveTabText} onChange={(v) => update("inactiveTabText", v)} />
        <ColorControl label="Border" value={state.inactiveTabBorder} onChange={(v) => update("inactiveTabBorder", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Tab Panel" subtitle="Content area colors.">
      <div className="space-y-4">
        <ColorControl label="Background" value={state.panelBg} onChange={(v) => update("panelBg", v)} />
        <ColorControl label="Text" value={state.panelText} onChange={(v) => update("panelText", v)} />
        <ColorControl label="Border" value={state.panelBorder} onChange={(v) => update("panelBorder", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Hover & disabled tab" subtitle="Hover and disabled tab states.">
      <div className="space-y-4">
        <ColorControl label="Hover background" value={state.hoverTabBg} onChange={(v) => update("hoverTabBg", v)} />
        <ColorControl label="Hover text" value={state.hoverTabText} onChange={(v) => update("hoverTabText", v)} />
        <ColorControl label="Hover border" value={state.hoverTabBorder} onChange={(v) => update("hoverTabBorder", v)} />
        <ColorControl label="Disabled text" value={state.disabledTabColor} onChange={(v) => update("disabledTabColor", v)} />
        <ColorControl label="Disabled background" value={state.disabledTabBg} onChange={(v) => update("disabledTabBg", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Indicator & list" subtitle="Active indicator and tab list surface.">
      <div className="space-y-4">
        <ColorControl label="Indicator" value={state.indicatorColor} onChange={(v) => update("indicatorColor", v)} />
        <ColorControl label="Tab list background" value={state.tabListBg} onChange={(v) => update("tabListBg", v)} />
        <ColorControl label="Tab list border" value={state.tabListBorder} onChange={(v) => update("tabListBorder", v)} />
        <ColorControl label="Scroll button background" value={state.scrollButtonBg} onChange={(v) => update("scrollButtonBg", v)} />
        <ColorControl label="Scroll button color" value={state.scrollButtonColor} onChange={(v) => update("scrollButtonColor", v)} />
      </div>
    </SectionCard>
      <SectionCard title="Badge, close & icon" subtitle="Tab badge, close button, and icons.">
      <div className="space-y-4">
        <ColorControl label="Badge background" value={state.badgeBg} onChange={(v) => update("badgeBg", v)} />
        <ColorControl label="Badge text" value={state.badgeText} onChange={(v) => update("badgeText", v)} />
        <ColorControl label="Close icon" value={state.closeIconColor} onChange={(v) => update("closeIconColor", v)} />
        <ColorControl label="Close hover background" value={state.closeIconHoverBg} onChange={(v) => update("closeIconHoverBg", v)} />
        <ColorControl label="Icon" value={state.iconColor} onChange={(v) => update("iconColor", v)} />
        <ColorControl label="Icon active" value={state.iconActiveColor} onChange={(v) => update("iconActiveColor", v)} />
      </div>
    </SectionCard>
    </div>
  );
}
