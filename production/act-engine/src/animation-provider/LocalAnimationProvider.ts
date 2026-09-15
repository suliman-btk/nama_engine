import type { AnimationAsset, AnimationCandidate, AnimationProvider, RegistryEntry } from "./types";

/**
 * Priority 1 from rule 7: the local approved library. Reads shared/animations/registry.json
 * and refuses (throws) to hand back anything not explicitly `approved: true` — see rule 6
 * ("if licensing information is missing or unclear: DO NOT USE THE ASSET") and rule 8.
 * This is the ONLY provider the renderer should reach for by default; MCP/remote providers
 * (LottieFilesMCPProvider, etc.) implement the same interface and are tried only when this
 * one has no suitable asset, per rule 7's priority order — never the other way around.
 */
export class LocalAnimationProvider implements AnimationProvider {
  constructor(private registry: RegistryEntry[]) {}

  static fromRegistryJson(json: unknown): LocalAnimationProvider {
    if (!Array.isArray(json)) {
      throw new Error("shared/animations/registry.json must be a JSON array of RegistryEntry.");
    }
    return new LocalAnimationProvider(json as RegistryEntry[]);
  }

  async search(query: string): Promise<AnimationCandidate[]> {
    const q = query.toLowerCase();
    return this.registry
      .filter((e) => e.approved && (e.name.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q))))
      .map((e) => ({
        id: e.id,
        name: e.name,
        license: e.license,
        cost: e.cost,
        commercialUse: e.commercial_use,
        source: e.source,
      }));
  }

  async fetch(id: string): Promise<AnimationAsset> {
    const entry = this.registry.find((e) => e.id === id);
    if (!entry) {
      throw new Error(`Animation "${id}" is not in the local registry.`);
    }
    assertApproved(entry);
    return {
      id: entry.id,
      localFile: entry.file,
      format: entry.file.endsWith(".svg") ? "svg" : "lottie",
    };
  }
}

/** The licensing gate. Every path that hands an animation to the renderer — local registry
 * lookup, an MCP provider's result, a cache hit — must pass through this before the asset
 * is used in a render. There is deliberately no way to bypass it. */
export function assertApproved(entry: RegistryEntry): void {
  if (!entry.approved) {
    throw new Error(
      `Refusing to use animation "${entry.id}" (${entry.name}): not marked approved:true in the registry. ` +
        `Per rule 6, unclear or unverified licensing means DO NOT USE — pick an approved asset, ` +
        `build the motion programmatically (rule 7 priority 3), or skip the animation entirely (priority 4).`
    );
  }
  if (entry.cost === "paid") {
    throw new Error(`Refusing to use animation "${entry.id}": marked cost:"paid". Premium assets are never used (rule 6).`);
  }
  if (entry.commercial_use !== true) {
    throw new Error(`Refusing to use animation "${entry.id}": commercial_use is not confirmed true.`);
  }
}
