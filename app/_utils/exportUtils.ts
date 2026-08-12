import type { TabsState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

function resolveFont(state: TabsState): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "system-ui");
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
    "  const [hoverIndex, setHoverIndex] = React.useState(-1);",
    "  const [closeHoverIndex, setCloseHoverIndex] = React.useState(-1);",
    "  const selectedIndex = enabledIndexes.includes(activeIndex) ? activeIndex : enabledIndexes[0] ?? 0;",
    "  const isVertical = state.orientation === \"vertical\";",
    "  const isUnderline = state.indicator === \"underline\";",
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
    `      border: state.borderWidth + "px ${state.borderStyle} " + (state.disabled && state.disabledUseCustomColors ? state.disabledBorder : "${state.border}"),`,
    `      boxShadow: "${shadow}",`,
    `      background: state.disabled && state.disabledUseCustomColors ? state.disabledBg : "${state.background}",`,
    `      color: state.foreground,`,
    `      fontFamily: ${JSON.stringify(resolvedFont)},`,
    `      fontStyle: "${state.fontStyle}",`,
    `      textTransform: "${state.textTransform}",`,
    `      textDecoration: "${state.textDecoration}",`,
    `      letterSpacing: "${state.letterSpacing}${state.letterSpacingUnit}",`,
    `      lineHeight: ${state.lineHeight},`,
    `      opacity: state.disabled ? (state.disabledOpacity ?? 0.5) : 1,
cursor: state.disabled ? state.disabledCursor : undefined,`,
    "    }}>",
    "      <div style={{ display: \"grid\", gap: 6 }}>",
    `        <p style={{ margin: 0, color: state.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{state.label}</p>`,
    `        <h2 style={{ margin: 0, fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h2>`,
    `        <p style={{ margin: 0, color: state.muted, fontSize: state.bodySize }}>{state.description}</p>`,
    "      </div>",
    "      <div style={{ display: \"grid\", gridTemplateColumns: isVertical ? \"minmax(140px, 0.45fr) 1fr\" : \"1fr\", gap: Math.max(10, state.gap) }}>",
    "        <div style={{ display: \"flex\", flexDirection: isVertical ? \"column\" : \"row\", alignItems: \"center\", gap: 6 }}>",
    "          {!isVertical && state.overflowMode === \"scroll\" ? <button type=\"button\" aria-label=\"Scroll tabs left\" style={{ flexShrink: 0, display: \"grid\", placeItems: \"center\", width: 28, height: 28, borderRadius: 8, border: 0, background: state.scrollButtonBg, color: state.scrollButtonColor, cursor: \"pointer\" }}>‹</button> : null}",
    "          <div role=\"tablist\" aria-label={state.ariaLabel} aria-orientation={state.orientation} data-activation-mode={state.activationMode} style={{ display: \"flex\", flexDirection: isVertical ? \"column\" : \"row\", gap: state.tabGap, flexWrap: !isVertical && state.overflowMode === \"wrap\" ? \"wrap\" : \"nowrap\", overflowX: !isVertical && state.overflowMode === \"scroll\" ? \"auto\" : \"visible\", width: \"100%\", padding: state.tabListBg !== \"transparent\" || state.tabListBorder !== \"transparent\" ? 6 : 0, borderRadius: 10, background: state.tabListBg, border: \"1px solid \" + state.tabListBorder }}>",
    "          {Array.from({ length: itemCount }, (_, index) => {",
    "            const disabled = state.disabled || index < disabledCount;",
    "            const selected = index === selectedIndex;",
    "            const hovered = hoverIndex === index && !disabled && !selected;",
    "            const tabId = state.id + \"-tab-\" + (index + 1);",
    "            const panelId = state.id + \"-panel-\" + (index + 1);",
    "            const bg = disabled ? state.disabledTabBg : selected ? state.activeTabBg : hovered ? state.hoverTabBg : \"transparent\";",
    "            const fg = disabled ? state.disabledTabColor : selected ? state.activeTabText : hovered ? state.hoverTabText : state.inactiveTabText;",
    "            const bc = disabled ? state.inactiveTabBorder : selected ? state.activeTabBorder : hovered ? state.hoverTabBorder : state.inactiveTabBorder;",
    "            const icon = <svg aria-hidden=\"true\" width={state.iconSize} height={state.iconSize} viewBox=\"0 0 14 14\" fill=\"none\" style={{ flexShrink: 0 }}><circle cx=\"7\" cy=\"7\" r=\"5\" stroke={selected ? state.iconActiveColor : state.iconColor} strokeWidth=\"1.6\" /></svg>;",
    "            return (",
    "              <button key={tabId} type=\"button\" id={tabId} role=\"tab\" aria-selected={selected} aria-controls={panelId} aria-disabled={disabled} disabled={disabled} tabIndex={selected ? 0 : -1}",
    "                onClick={() => !disabled && setActiveIndex(index)}",
    "                onMouseEnter={() => setHoverIndex(index)}",
    "                onMouseLeave={() => setHoverIndex(-1)}",
    "                onKeyDown={(event) => !disabled && handleKeyDown(event, index)}",
    "                style={{",
    "                  position: \"relative\",",
    "                  display: \"inline-flex\",",
    "                  alignItems: \"center\",",
    "                  gap: 8,",
    "                  border: state.borderWidth + \"px \" + state.borderStyle + \" \" + bc,",
    "                  borderRadius: isUnderline ? 8 : state.tabRadius,",
    "                  background: bg,",
    "                  color: fg,",
    "                  cursor: disabled ? \"not-allowed\" : \"pointer\",",
    "                  font: \"inherit\",",
    "                  fontWeight: selected ? 700 : 500,",
    "                  opacity: disabled ? state.disabledOpacity : 1,",
    "                  padding: state.tabPaddingY + \"px \" + state.tabPaddingX + \"px\",",
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
    "                {state.iconPosition === \"left\" ? icon : null}",
    "                <span>{state.label} {index + 1}</span>",
    "                {index === 1 ? <span style={{ display: \"inline-grid\", placeItems: \"center\", minWidth: 18, height: 18, padding: \"0 5px\", fontSize: 11, fontWeight: 700, background: state.badgeBg, color: state.badgeText, borderRadius: state.badgeRadius }}>3</span> : null}",
    "                {state.iconPosition === \"right\" ? icon : null}",
    "                {state.closableTabs ? <span role=\"button\" aria-label={\"Close \" + state.label + \" \" + (index + 1)} onMouseEnter={() => setCloseHoverIndex(index)} onMouseLeave={() => setCloseHoverIndex(-1)} style={{ display: \"grid\", placeItems: \"center\", width: 18, height: 18, borderRadius: 6, color: state.closeIconColor, background: closeHoverIndex === index ? state.closeIconHoverBg : \"transparent\" }}><svg aria-hidden=\"true\" width=\"10\" height=\"10\" viewBox=\"0 0 10 10\" fill=\"none\"><path d=\"M2 2l6 6M8 2l-6 6\" stroke=\"currentColor\" strokeWidth=\"1.4\" strokeLinecap=\"round\" /></svg></span> : null}",
    "                {isUnderline && selected ? <span aria-hidden=\"true\" style={{ position: \"absolute\", left: 8, right: 8, bottom: -1, height: state.indicatorHeight, background: state.indicatorColor, borderRadius: state.indicatorRadius }} /> : null}",
    "              </button>",
    "            );",
    "          })}",
    "          </div>",
    "          {!isVertical && state.overflowMode === \"scroll\" ? <button type=\"button\" aria-label=\"Scroll tabs right\" style={{ flexShrink: 0, display: \"grid\", placeItems: \"center\", width: 28, height: 28, borderRadius: 8, border: 0, background: state.scrollButtonBg, color: state.scrollButtonColor, cursor: \"pointer\" }}>›</button> : null}",
    "        </div>",
    "        {Array.from({ length: itemCount }, (_, index) => {",
    "          const selected = index === selectedIndex;",
    "          const tabId = state.id + \"-tab-\" + (index + 1);",
    "          const panelId = state.id + \"-panel-\" + (index + 1);",
    "          return (",
    "            <div key={panelId} id={panelId} role=\"tabpanel\" aria-labelledby={tabId} tabIndex={selected ? 0 : -1} aria-hidden={!selected || undefined} style={{",
    "              minHeight: Math.max(120, Math.round(state.height / 3)),",
    "              borderRadius: state.panelRadius,",
    `              border: state.borderWidth + "px " + state.borderStyle + " " + state.panelBorder,`,
    "              background: state.panelBg,",
    "              color: state.panelText,",
    "              fontSize: state.bodySize,",
    "              padding: state.panelPadding,",
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
