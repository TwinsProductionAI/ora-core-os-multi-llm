export enum PlanId {
  FREE = 'FREE',
  CREATOR = 'CREATOR',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface OraModule {
  id: string;
  publicName: string;
  internalName: string;
  glyph?: string;
  nanoEssence: string;
  description: string;
  category: string;
  tier: PlanId;
  compatibleOutputs: ('DIRECT_PROMPT' | 'PROJECT_MD' | 'MASTER_PREFS')[];
  dependencies: string[];
  conflicts: string[];
  tokenCostWeight: number;
  tags: string[];
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'EXOTIC' | 'LEGENDARY' | 'MYTHIC';
  marketValue?: number;
  complexityScore?: string;
  demandIndex?: string;
}

export interface Capability {
  id: string;
  label: string;
  description: string;
  category: string;
  mappedModules: string[];
  requiredPlan: PlanId;
  keywords: string[];
}

export interface OraDbFile {
  id: string;
  path: string;
  name: string;
  extension: string;
  kind: string;
  bytes: number;
  sha256: string;
  modified: string;
}

export interface OraDbCatalog {
  id: string;
  version: string;
  generated_at: string;
  source: string;
  excludes: string[];
  file_count: number;
  files: OraDbFile[];
}

export interface OraPack {
  id: string;
  label: string;
  description: string;
  file_ids: string[];
}

export interface OraPackRegistry {
  id: string;
  version: string;
  packs: OraPack[];
}

export interface InstallationRecipe {
  id: string;
  label: string;
  target: string;
  install_mode: string;
  recommended_packs: string[];
  steps: string[];
  notes: string[];
}

export interface InstallationRecipeRegistry {
  id: string;
  version: string;
  recipes: InstallationRecipe[];
}
