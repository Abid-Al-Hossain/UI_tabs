import type { TabsState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

const SYSTEM_FONTS: Record<number, string> = {
  0: "Arial, system-ui",
  1: 'Consolas, "Liberation Mono", "Courier New", ui-monospace, monospace',
  2: '"Courier New", ui-monospace, monospace',
  3: "Georgia, ui-serif, serif",
  4: "Helvetica, Arial, system-ui",
  5: 'Menlo, Monaco, Consolas, "Liberation Mono", ui-monospace, monospace',
  6: '"Segoe UI", system-ui, sans-serif',
  7: '"SF Pro Display", system-ui, sans-serif',
  8: "system-ui, sans-serif",
  9: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  10: '"Times New Roman", ui-serif, serif',
  11: '"Trebuchet MS", sans-serif',
  12: "Verdana, sans-serif",
  13: '"Comic Sans MS", cursive',
};

function resolveFont(state: TabsState): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx] ?? "inherit");
}

function buildBorderRadius(state: TabsState, offset = 0): string {
  if (state.radiusLinked) return `${Math.max(0, state.radius - offset)}px`;
  return `${Math.max(0, state.radiusTL - offset)}px ${Math.max(0, state.radiusTR - offset)}px ${Math.max(0, state.radiusBR - offset)}px ${Math.max(0, state.radiusBL - offset)}px`;
}

function buildShadow(state: TabsState): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildTransition(state: TabsState, properties: string): string {
  if (state.transitionDuration <= 0) return "none";
  return properties.split(", ").map((p) => `${p} ${state.transitionDuration}ms ${state.transitionEasing}`).join(", ");
}

function googleFontLink(state: TabsState): string {
  if (state.fontBucket !== "google") return "";
  const family = state.googleFontFamily.replace(/ /g, "+");
  return `<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link href="https://fonts.googleapis.com/css2?family=${family}:wght@400;500;700&display=swap" rel="stylesheet" />\n`;
}

export function buildExportPayload(state: TabsState, fileName = "tabs"): ExportPayload {
  return { fileName: `${fileName || "tabs"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: TabsState) {
  const fontLink = googleFontLink(state);
  const resolvedFont = resolveFont(state);
  const borderRadius = buildBorderRadius(state);
  const tabBorderRadius = state.radiusLinked
    ? `${Math.max(10, state.radius - 8)}px`
    : `${Math.max(10, state.radiusTL - 8)}px`;
  const panelBorderRadius = state.radiusLinked
    ? `${Math.max(12, state.radius - 4)}px`
    : `${Math.max(12, state.radiusBR - 4)}px`;
  const shadow = buildShadow(state);
  const tabTransition = buildTransition(state, "background, border-color, color");
  const panelTransition = buildTransition(state, "opacity");
  const focusOutline = state.focusRingEnabled
    ? `outline: "${state.focusRingWidth}px solid ${state.focusRingColor}", outlineOffset: "${state.focusRingOffset}px"`
    : "";

  return [
    "import * as React from \"react\";",
    "",
    ...(fontLink ? [`/* ${fontLink.trim()} */`, ""] : []),
    "const state = " + JSON.stringify({
      ...state,
      _resolvedFont: resolvedFont,
      _borderRadius: borderRadius,
      _tabBorderRadius: tabBorderRadius,
      _panelBorderRadius: panelBorderRadius,
      _shadow: shadow,
      _tabTransition: tabTransition,
      _panelTransition: panelTransition,
    }, null, 2) + ";",
    "",
    "export default function TabsComponent() {",
    "  const itemCount = Math.max(1, Math.round(state.itemCount));",
    "  const disabledCount = Math.max(0, Math.min(itemCount, Math.round(state.disabledItems)));",
    "  const enabledIndexes = Array.from({ length: itemCount }, (_, index) => index).filter((index) => index >= disabledCount);",
    "  const initialIndex = enabledIndexes.includes(state.activeIndex) ? state.activeIndex : enabledIndexes[0] ?? 0;",
    "  const [activeIndex, setActiveIndex] = React.useState(initialIndex);",
    "  const selectedIndex = enabledIndexes.includes(activeIndex) ? activeIndex : enabledIndexes[0] ?? 0;",
    "  const isVertical = state.orientation === \"vertical\";",
    "",
    "  const moveSelection = (current, direction) => {",
    "    if (!enabledIndexes.length) return current;",
    "    const currentPosition = Math.max(0, enabledIndexes.indexOf(current));",
    "    return enabledIndexes[(currentPosition + direction + enabledIndexes.length) % enabledIndexes.length];",
    "  };",
    "",
    "  const handleKeyDown = (event, index) => {",
    "    const previousKey = isVertical ? \"ArrowUp\" : \"ArrowLeft\";",
    "    const nextKey = isVertical ? \"ArrowDown\" : \"ArrowRight\";",
    "    const automatic = state.activationMode === \"automatic\";",
    "    if (event.key === \"Home\") { event.preventDefault(); setActiveIndex(enabledIndexes[0] ?? index); return; }",
    "    if (event.key === \"End\") { event.preventDefault(); setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? index); return; }",
    "    if (automatic && event.key === previousKey) { event.preventDefault(); setActiveIndex((current) => moveSelection(current, -1)); return; }",
    "    if (automatic && event.key === nextKey) { event.preventDefault(); setActiveIndex((current) => moveSelection(current, 1)); return; }",
    "    if (event.key === \"Enter\" || event.key === \" \") { event.preventDefault(); setActiveIndex(index); }",
    "  };",
    "",
    "  return (",
    "    <section id={state.id} role=\"region\" aria-label={state.ariaLabel} tabIndex={state.disabled ? -1 : state.tabIndex} style={{",
    `      width: state.width,`,
    `      minHeight: state.height,`,
    `      padding: state.padding,`,
    `      display: "grid",`,
    `      gap: state.gap,`,
    `      borderRadius: "${borderRadius}",`,
    `      border: state.borderWidth + "px ${state.borderStyle} ${state.border}",`,
    `      boxShadow: "${shadow}",`,
    `      background: state.background,`,
    `      color: state.foreground,`,
    `      fontFamily: "${resolvedFont}",`,
    `      fontStyle: "${state.fontStyle}",`,
    `      textTransform: "${state.textTransform}",`,
    `      textDecoration: "${state.textDecoration}",`,
    `      letterSpacing: "${state.letterSpacing}${state.letterSpacingUnit}",`,
    `      lineHeight: ${state.lineHeight},`,
    `      opacity: state.disabled ? 0.55 : 1,`,
    "    }}>",
    "      <div style={{ display: \"grid\", gap: 6 }}>",
    `        <p style={{ margin: 0, color: state.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{state.label}</p>`,
    `        <h2 style={{ margin: 0, fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h2>`,
    `        <p style={{ margin: 0, color: state.muted, fontSize: state.bodySize }}>{state.description}</p>`,
    "      </div>",
    "      <div style={{ display: \"grid\", gridTemplateColumns: isVertical ? \"minmax(140px, 0.45fr) 1fr\" : \"1fr\", gap: Math.max(10, state.gap) }}>",
    "        <div role=\"tablist\" aria-label={state.ariaLabel} aria-orientation={state.orientation} data-activation-mode={state.activationMode} style={{ display: \"flex\", flexDirection: isVertical ? \"column\" : \"row\", gap: 8, flexWrap: \"wrap\" }}>",
    "          {Array.from({ length: itemCount }, (_, index) => {",
    "            const disabled = state.disabled || index < disabledCount;",
    "            const selected = index === selectedIndex;",
    "            const tabId = state.id + \"-tab-\" + (index + 1);",
    "            const panelId = state.id + \"-panel-\" + (index + 1);",
    "            return (",
    "              <button key={tabId} type=\"button\" id={tabId} role=\"tab\" aria-selected={selected} aria-controls={panelId} aria-disabled={disabled} disabled={disabled} tabIndex={selected ? 0 : -1}",
    "                onClick={() => !disabled && setActiveIndex(index)}",
    "                onKeyDown={(event) => !disabled && handleKeyDown(event, index)}",
    "                style={{",
    `                  border: state.borderWidth + "px solid " + (selected ? state.accent : state.border),`,
    `                  borderRadius: state.indicator === "underline" ? "8px" : "${tabBorderRadius}",`,
    `                  borderBottomWidth: state.indicator === "underline" && selected ? Math.max(2, state.borderWidth + 2) : state.borderWidth,`,
    `                  background: selected ? "color-mix(in oklab, " + state.accent + " 18%, transparent)" : "transparent",`,
    "                  color: selected ? state.foreground : state.muted,",
    "                  cursor: disabled ? \"not-allowed\" : \"pointer\",",
    "                  font: \"inherit\",",
    "                  fontWeight: selected ? 700 : 500,",
    "                  opacity: disabled ? 0.5 : 1,",
    "                  padding: \"12px 14px\",",
    "                  textAlign: \"left\",",
    `                  transition: "${tabTransition}",`,
    ...(state.focusRingEnabled
      ? [
        `                  outline: "${state.focusRingWidth}px solid ${state.focusRingColor}",`,
        `                  outlineOffset: "${state.focusRingOffset}px",`,
      ]
      : []),
    "                }}",
    "              >",
    "                {state.label} {index + 1}",
    "              </button>",
    "            );",
    "          })}",
    "        </div>",
    "        {Array.from({ length: itemCount }, (_, index) => {",
    "          const selected = index === selectedIndex;",
    "          const tabId = state.id + \"-tab-\" + (index + 1);",
    "          const panelId = state.id + \"-panel-\" + (index + 1);",
    "          return (",
    "            <div key={panelId} id={panelId} role=\"tabpanel\" aria-labelledby={tabId} tabIndex={selected ? 0 : -1} aria-hidden={!selected || undefined} style={{",
    "              minHeight: Math.max(120, Math.round(state.height / 3)),",
    `              borderRadius: "${panelBorderRadius}",`,
    `              border: state.borderWidth + "px solid " + state.border,`,
    "              background: \"rgba(255,255,255,0.06)\",",
    "              color: state.muted,",
    "              fontSize: state.bodySize,",
    "              padding: 16,",
    "              display: selected ? undefined : \"none\",",
    "              opacity: selected ? 1 : 0,",
    `              transition: "${panelTransition}",`,
    "            }}>",
    "              <strong style={{ display: \"block\", color: state.foreground, marginBottom: 8 }}>{state.label} {index + 1}</strong>",
    "              <p style={{ margin: 0 }}>{state.helper} Keyboard export handles Home, End, Enter, Space, and automatic arrow-key activation.</p>",
    "            </div>",
    "          );",
    "        })}",
    "      </div>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join("\n");
}
