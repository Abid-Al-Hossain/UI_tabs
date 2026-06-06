"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import { TABS_PRESETS } from "../_data/TabsPresets";
import type { StudioPreset } from "../types";

const PAGE_SIZE = 8;

export default function PresetsSection({ activePresetId, onApply }: { activePresetId: string | null; onApply: (preset: StudioPreset) => void }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [size, setSize] = useState("all");
  const [page, setPage] = useState(1);
  const [surpriseIndex, setSurpriseIndex] = useState(0);
  const families = useMemo(() => ["all", ...Array.from(new Set(TABS_PRESETS.map((preset) => preset.family)))], []);
  const sizes = useMemo(() => ["all", ...Array.from(new Set(TABS_PRESETS.map((preset) => preset.size)))], []);
  const filtered = TABS_PRESETS.filter((preset) => [preset.family, preset.archetype, preset.variant, preset.size, ...preset.tags].join(" ").toLowerCase().includes(query.toLowerCase()) && (family === "all" || preset.family === family) && (size === "all" || preset.size === size));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const source = filtered.length ? filtered : TABS_PRESETS;

  useEffect(() => {
    setPage(1);
  }, [query, family, size]);

  const resetFilters = () => {
    setQuery("");
    setFamily("all");
    setSize("all");
    setPage(1);
  };

  const applySurprise = () => {
    const nextIndex = surpriseIndex % source.length;
    setSurpriseIndex((value) => value + 1);
    onApply(source[nextIndex]);
  };

  return <SectionCard title="Presets" subtitle="48 structured full-state presets."><div className="grid gap-3 sm:grid-cols-3" data-testid="preset-filters" data-audit="preset-filters"><Input label="Search presets" value={query} onChange={setQuery} /><Select label="Family" value={family} options={families} onChange={setFamily} /><Select label="Size" value={size} options={sizes} onChange={setSize} /></div><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm" style={{ color: "var(--muted)" }} data-testid="preset-result-count" data-audit="preset-result-count">{filtered.length} of {TABS_PRESETS.length} presets shown</p><div className="flex flex-wrap gap-2"><button type="button" onClick={resetFilters} data-testid="preset-reset-button" data-audit="preset-reset-button" className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Reset filters</button><button type="button" onClick={applySurprise} data-testid="preset-surprise-button" data-audit="preset-surprise-button" className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Surprise me</button></div></div><div className="flex flex-wrap gap-2" aria-label="Applied preset filters" data-testid="preset-applied-filters" data-audit="preset-applied-filters">{query && <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Search: {query}</span>}{family !== "all" && <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Family: {family}</span>}{size !== "all" && <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Size: {size}</span>}{!query && family === "all" && size === "all" && <span className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No filters applied</span>}</div><div className="grid gap-3" data-testid="preset-results" data-audit="preset-results">{pageItems.map((preset) => <button key={preset.id} type="button" data-testid="preset-apply-button" data-audit="preset-apply-button" aria-pressed={activePresetId === preset.id} onClick={() => onApply(preset)} className="rounded-2xl border p-4 text-left" style={{ borderColor: activePresetId === preset.id ? "var(--primary)" : "var(--border)", background: activePresetId === preset.id ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "color-mix(in oklab, var(--card) 65%, transparent)", color: "var(--text)" }}><strong>{preset.archetype}</strong><span className="ml-2 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{preset.variant} / {preset.size}</span><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{preset.tags.join(", ")}</p></button>)}</div><div className="flex items-center justify-between gap-3" data-testid="preset-pagination" data-audit="preset-pagination"><button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Previous</button><span className="text-sm" style={{ color: "var(--muted)" }}>Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Next</button></div></SectionCard>;
}
