/**
 * Showcase-mode flag + tiny mock-latency helper. Everything in village/
 * is already mock-by-default (no real endpoint exists for most sources
 * yet) — this only matters for the handful of panels that DO call the
 * real Hermes backend (ForgeCommandWindow, ObsidianPanel, ObsidianGraph),
 * so they can skip that call under the standalone showcase build.
 */
export const SHOWCASE_MODE = import.meta.env.VITE_SHOWCASE_MODE === "true";

export function mockDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
