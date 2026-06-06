"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { TabsState } from "../types";

function shell(state: TabsState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    display: "grid",
    gap: state.gap,
    borderRadius: state.radius,
    border: `${state.borderWidth}px solid ${state.border}`,
    boxShadow: `0 ${Math.round(state.shadow / 3)}px ${state.shadow}px rgba(0,0,0,.28)`,
    background: state.background,
    color: state.foreground,
    fontFamily: state.fontFamily,
    opacity: state.disabled ? 0.55 : 1,
  };
}

export default function LivePreview({ state }: { state: TabsState }) {
  const itemCount = Math.max(1, Math.round(state.itemCount));
  const disabledCount = Math.max(0, Math.min(itemCount, Math.round(state.disabledItems)));
  const enabledIndexes = Array.from({ length: itemCount }, (_, index) => index).filter((index) => index >= disabledCount);
  const initialIndex = enabledIndexes.includes(state.activeIndex) ? state.activeIndex : enabledIndexes[0] ?? 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const selectedIndex = enabledIndexes.includes(activeIndex) ? activeIndex : enabledIndexes[0] ?? 0;
  const isVertical = state.orientation === "vertical";

  const moveSelection = (current: number, direction: 1 | -1) => {
    if (!enabledIndexes.length) return current;
    const currentPosition = Math.max(0, enabledIndexes.indexOf(current));
    return enabledIndexes[(currentPosition + direction + enabledIndexes.length) % enabledIndexes.length];
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const previousKey = isVertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
    const automatic = state.activationMode === "automatic";

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? index);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? index);
      return;
    }

    if (automatic && event.key === previousKey) {
      event.preventDefault();
      setActiveIndex((current) => moveSelection(current, -1));
      return;
    }

    if (automatic && event.key === nextKey) {
      event.preventDefault();
      setActiveIndex((current) => moveSelection(current, 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <section id={state.id} role="region" aria-label={state.ariaLabel} tabIndex={state.disabled ? -1 : state.tabIndex} style={shell(state)}>
      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, color: state.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{state.label}</p>
        <h2 style={{ margin: 0, fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h2>
        <p style={{ margin: 0, color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isVertical ? "minmax(140px, 0.45fr) 1fr" : "1fr", gap: Math.max(10, state.gap) }}>
        <div
          role="tablist"
          aria-label={state.ariaLabel}
          aria-orientation={state.orientation}
          data-activation-mode={state.activationMode}
          style={{ display: "flex", flexDirection: isVertical ? "column" : "row", gap: 8, flexWrap: "wrap" }}
        >
          {Array.from({ length: itemCount }, (_, index) => {
            const disabled = state.disabled || index < disabledCount;
            const selected = index === selectedIndex;
            const tabId = `${state.id}-tab-${index + 1}`;
            const panelId = `${state.id}-panel-${index + 1}`;

            return (
              <button
                key={tabId}
                type="button"
                id={tabId}
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                aria-disabled={disabled}
                disabled={disabled}
                tabIndex={selected ? 0 : -1}
                onClick={() => !disabled && setActiveIndex(index)}
                onKeyDown={(event) => !disabled && handleKeyDown(event, index)}
                style={{
                  border: `${state.borderWidth}px solid ${selected ? state.accent : state.border}`,
                  borderRadius: state.indicator === "underline" ? 8 : Math.max(10, state.radius - 8),
                  borderBottomWidth: state.indicator === "underline" && selected ? Math.max(2, state.borderWidth + 2) : state.borderWidth,
                  background: selected ? `color-mix(in oklab, ${state.accent} 18%, transparent)` : "transparent",
                  color: selected ? state.foreground : state.muted,
                  cursor: disabled ? "not-allowed" : "pointer",
                  font: "inherit",
                  fontWeight: selected ? 700 : 500,
                  opacity: disabled ? 0.5 : 1,
                  padding: "12px 14px",
                  textAlign: "left",
                }}
              >
                {state.label} {index + 1}
              </button>
            );
          })}
        </div>
        {Array.from({ length: itemCount }, (_, index) => {
          const selected = index === selectedIndex;
          const tabId = `${state.id}-tab-${index + 1}`;
          const panelId = `${state.id}-panel-${index + 1}`;

          return (
            <div
              key={panelId}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              tabIndex={0}
              hidden={!selected}
              style={{
                minHeight: Math.max(120, Math.round(state.height / 3)),
                borderRadius: Math.max(12, state.radius - 4),
                border: `${state.borderWidth}px solid ${state.border}`,
                background: "rgba(255,255,255,0.06)",
                color: state.muted,
                fontSize: state.bodySize,
                padding: 16,
              }}
            >
              <strong style={{ display: "block", color: state.foreground, marginBottom: 8 }}>{state.label} {index + 1}</strong>
              <p style={{ margin: 0 }}>{state.helper} Keyboard export handles Home, End, Enter, Space, and automatic arrow-key activation.</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
