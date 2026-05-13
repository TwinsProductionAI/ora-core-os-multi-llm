/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PlanId {
  FREE = 'FREE',
  CREATOR = 'CREATOR',
  PRO = 'PRO',
  PRO_PLUS = 'PRO_PLUS',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Module {
  id: string;
  publicName: string;
  internalName: string; // Hidden from user
  nanoEssence: string; // Minified essence representation
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
  glyph?: string;
}

export interface Capability {
  id: string;
  label: string;
  description: string;
  category: string;
  mappedModules: string[]; // List of module IDs
  requiredPlan: PlanId;
  keywords: string[];
}

export interface Artifacts {
  directPrompt: {
    tokenEstimate: number;
    grenaprompt: string;
    gpv2Minified: string;
  };
  projectMd: string;
  masterPreferences: string;
}

export interface ChatMessage {
  id: string;
  role: 'ORA' | 'user';
  content: string;
  timestamp: Date;
  isActionable?: boolean;
}

export interface UserProfile {
  profession: string;
  aiNeeds: string;
}

export interface CustomModule {
  id: string;
  name: string;
  status: 'FORGE' | 'GRAYLIGHT' | 'GREENLIGHT' | 'PENDING_REVIEW';
  essence: string;
  date: string;
  description: string;
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'EXOTIC' | 'LEGENDARY' | 'MYTHIC';
  marketValue?: number;
  complexityScore?: string;
  demandIndex?: string;
  dependencies: string[];
  conflicts: string[];
  proposedAt?: string;
  adminRecommendation?: string;
  ragTrace?: {
    indexStatus: 'INDEXED' | 'UNSURE';
    hash: string;
    auditLog: string[];
  };
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

export interface OraDbSummary {
  id: string;
  version: string;
  generatedAt: string;
  source: string;
  excludes: string[];
  fileCount: number;
  packCount: number;
  recipeCount: number;
  kinds: string[];
  extensions: string[];
}

export interface OraPack {
  id: string;
  label: string;
  description: string;
  file_ids: string[];
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

export interface AppState {
  currentStep: 'LANDING' | 'CHAT' | 'CAPABILITIES' | 'RESULTS';
  currentMainView: 'DASHBOARD' | 'REGISTRY' | 'INSTALL_CENTER' | 'ACADEMY' | 'CREATOR_HUB' | 'SETTINGS' | 'ADMIN';
  userPlan: PlanId;
  isAdmin: boolean;
  userProfile: UserProfile;
  besoin: string;
  selectedCapabilities: string[]; // Capability IDs
  selectedAcademyModules: string[];
  iaOsPreferences: {
    darkMode: boolean;
    maxPrivacy: boolean;
    autoOpt: boolean;
  };
  messages: ChatMessage[];
  artifacts: Artifacts | null;
  customModules: CustomModule[];
  credits: number;
  ownedModuleIds: string[];
  isCanonDiscovered: boolean;
  aletheiaReflection?: {
    status: string;
    reflection: string;
    stats: {
      coherence: number;
      fluidity: number;
      energy: number;
      dream_alignment: number;
    };
  };
}
