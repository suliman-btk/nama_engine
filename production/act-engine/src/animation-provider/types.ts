/**
 * Provider-independent animation sourcing, per rule 18. The renderer only ever talks to
 * this interface — never to LottieFiles, an MCP, or any specific vendor directly — so
 * swapping or adding a source later doesn't touch rendering code.
 */
export type AnimationCandidate = {
  id: string;
  name: string;
  previewUrl?: string;
  license: string;
  cost: "free" | "paid" | "unknown";
  commercialUse: boolean | "unknown";
  source: string;
};

export type AnimationAsset = {
  id: string;
  localFile: string; // path under shared/animations/{lottie,svg}/
  format: "lottie" | "svg";
};

export interface AnimationProvider {
  search(query: string): Promise<AnimationCandidate[]>;
  fetch(id: string): Promise<AnimationAsset>;
}

/** One entry in shared/animations/registry.json — rule 8's required record for every
 * external asset ever pulled in. */
export type RegistryEntry = {
  id: string;
  name: string;
  file: string;
  source: string;
  source_url?: string;
  creator?: string;
  license: string;
  cost: "free" | "paid" | "unknown";
  commercial_use: boolean;
  approved: boolean;
  tags: string[];
};
