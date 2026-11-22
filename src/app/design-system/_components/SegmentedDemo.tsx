"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const lensOptions = [
  { value: "product", label: "Product" },
  { value: "systems", label: "Systems" },
] as const;

const filterOptions = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
] as const;

export function SegmentedDemo() {
  const [lens, setLens] = useState<(typeof lensOptions)[number]["value"]>("product");
  const [filter, setFilter] = useState<(typeof filterOptions)[number]["value"]>("all");

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl
          label="Portfolio lens"
          options={lensOptions}
          value={lens}
          onChange={setLens}
        />
        <span className="font-mono text-small text-muted">lens = {lens}</span>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl
          label="Filter projects"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
        <span className="font-mono text-small text-muted">filter = {filter}</span>
      </div>
    </div>
  );
}
