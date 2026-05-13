/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artifacts, Module, Capability } from '../types';
import { MOCK_MODULES, MOCK_CAPABILITIES } from './mockData';

export const compileArtifacts = (besoin: string, selectedCapabilityIds: string[]): Artifacts => {
  const selectedCapabilities = MOCK_CAPABILITIES.filter(c => selectedCapabilityIds.includes(c.id));
  const initialModuleIds = Array.from(new Set(selectedCapabilities.flatMap(c => c.mappedModules)));
  
  // Recursive dependency resolution
  const resolvedModuleIds = new Set<string>();
  const resolve = (ids: string[]) => {
    ids.forEach(id => {
      if (!resolvedModuleIds.has(id)) {
        resolvedModuleIds.add(id);
        const mod = MOCK_MODULES.find(m => m.id === id);
        if (mod && mod.dependencies.length > 0) {
          resolve(mod.dependencies);
        }
      }
    });
  };
  resolve(initialModuleIds);

  const selectedModules = MOCK_MODULES.filter(m => resolvedModuleIds.has(m.id));

  // Deterministic token estimation logic
  const baseTokens = 250;
  const modulesTokens = selectedModules.reduce((acc, m) => acc + m.tokenCostWeight, 0);
  const dependencyCost = selectedModules.reduce((acc, m) => acc + (m.dependencies?.length || 0) * 8, 0);
  const totalTokens = baseTokens + modulesTokens + dependencyCost;

  // Artifact A: Direct Prompt
  const directPrompt = {
    tokenEstimate: totalTokens,
    grenaprompt: `ORA_CORE_OS_v2.1_EXEC {
  INTENT="${besoin}";
  ESSENCE_MAP=[${selectedModules.map(m => m.nanoEssence).join(', ')}];
  PROTO=GRENAPROMPT_MAX;
}
[[${selectedModules.map(m => `${m.nanoEssence}::${m.publicName}`).join(' | ')}]]`,
    gpv2Minified: `[[ORA_OS_GPV2]]<${selectedModules.map(m => m.nanoEssence).join('::')}>⟨${besoin.slice(0, 30)}⟩`
  };

  // Artifact B: Project MD
  const projectMd = `# ORA_CORE_OS - Project Governance
## Besoin Sémantique
${besoin}

## Essences ORA Incluses
${selectedModules.map(m => `- **${m.nanoEssence}** (${m.publicName}) : ${m.description}`).join('\n')}

## Logique d'Extraction (Essence ZIP)
Les modules ont été compressés en essences "nano" pour maximiser la densité informationnelle sans compromettre la gouvernance.
`;

  // Artifact C: Master Preferences
  const masterPreferences = `/// ORA_CORE_OS_MASTER_KERNEL ///
- PROTOCOL: ORA_CORE_OS_v2.1
- ACTIVE_ESSENCES: ${selectedModules.map(m => m.nanoEssence).join(', ')}
- CORE_LOGIC: ACT AS EXTRACTED KERNEL FROM ORA_MODULES.
- TARGET_BESOIN: ${besoin}.
//////////////////////////////////////`;

  return {
    directPrompt,
    projectMd,
    masterPreferences
  };
};
