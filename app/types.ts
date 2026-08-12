export type SectionId = "presets" | "basics" | "metadata" | "items" | "behavior" | "layout" | "sizing" | "colors" | "border" | "radius" | "shadow" | "typography" | "transitions" | "focus-ring" | "states" | "disabled" | "accessibility";

export type TabsState = {
  title: string;
  description: string;
  label: string;
  helper: string;
  id: string;
  ariaLabel: string;
  tabIndex: number;
  width: number;
  height: number;
  gap: number;
  padding: number;
  radius: number;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "dotted" | "double" | "none";
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  border: string;
  activeTabBg: string;
  activeTabText: string;
  activeTabBorder: string;
  inactiveTabText: string;
  inactiveTabBorder: string;
  panelBg: string;
  panelText: string;
  panelBorder: string;
  // Typography (full button-parity)
  fontBucket: "system" | "google";
  fontSearch: string;
  systemFontIdx: number;
  googleFontFamily: string;
  titleSize: number;
  bodySize: number;
  fontSizeUnit: "px" | "rem";
  fontWeight: number;
  fontStyle: "normal" | "italic";
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration: "none" | "underline";
  letterSpacing: number;
  letterSpacingUnit: "px" | "em";
  lineHeight: number;
  // Radius (full corner control)
  radiusLinked: boolean;
  radiusTL: number;
  radiusTR: number;
  radiusBR: number;
  radiusBL: number;
  // Shadow (full control)
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOpacity: number;
  shadowColor: string;
  // Focus Ring
  focusRingEnabled: boolean;
  focusRingWidth: number;
  focusRingOffset: number;
  focusRingColor: string;
  // Transitions
  transitionDuration: number;
  transitionEasing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  previewState: "default" | "hover" | "focus" | "active" | "open" | "closed" | "selected" | "loading" | "empty" | "error" | "success";
  disabled: boolean;
  disabledOpacity: number;
  disabledCursor: "not-allowed" | "default" | "pointer";
  disabledUseCustomColors: boolean;
  disabledBg: string;
  disabledText: string;
  disabledBorder: string;
  role: "tablist";
  itemCount: number;
  activeIndex: number;
  orientation: "horizontal" | "vertical";
  activationMode: "automatic" | "manual";
  indicator: string;
  disabledItems: number;
  // Tab hover/disabled
  hoverTabBg: string;
  hoverTabText: string;
  hoverTabBorder: string;
  disabledTabColor: string;
  disabledTabBg: string;
  // Indicator
  indicatorColor: string;
  indicatorHeight: number;
  indicatorRadius: number;
  // Tab geometry
  tabGap: number;
  tabPaddingX: number;
  tabPaddingY: number;
  tabRadius: number;
  tabListBg: string;
  tabListBorder: string;
  // Panel
  panelPadding: number;
  panelRadius: number;
  // Overflow
  overflowMode: "scroll" | "dropdown" | "wrap";
  scrollButtonBg: string;
  scrollButtonColor: string;
  // Badge
  badgeBg: string;
  badgeText: string;
  badgeRadius: number;
  // Close & icons
  closableTabs: boolean;
  closeIconColor: string;
  closeIconHoverBg: string;
  iconColor: string;
  iconActiveColor: string;
  iconSize: number;
  iconPosition: "left" | "right";
};

export type StudioPreset = { id: string; family: string; archetype: string; variant: string; size: string; tags: string[]; state: Partial<TabsState> & Record<string, unknown> };

export const SECTIONS: Array<{ id: SectionId; label: string }> = [
  {
    "id": "presets",
    "label": "Presets"
  },
  {
    "id": "basics",
    "label": "Basics"
  },
  {
    "id": "metadata",
    "label": "Metadata"
  },
  {
    "id": "items",
    "label": "Items"
  },
  {
    "id": "behavior",
    "label": "Behavior"
  },
  {
    "id": "layout",
    "label": "Layout"
  },
  {
    "id": "sizing",
    "label": "Sizing"
  },
  {
    "id": "colors",
    "label": "Colors"
  },
  {
    "id": "border",
    "label": "Border"
  },
  {
    "id": "radius",
    "label": "Radius"
  },
  {
    "id": "shadow",
    "label": "Shadow"
  },
  {
    "id": "typography",
    "label": "Typography"
  },
  {
    "id": "transitions",
    "label": "Transitions"
  },
  {
    "id": "focus-ring",
    "label": "Focus Ring"
  },
  {
    "id": "states",
    "label": "State Preview"
  },
  {
    "id": "disabled",
    "label": "Disabled"
  },
  {
    "id": "accessibility",
    "label": "Accessibility"
  }
];
