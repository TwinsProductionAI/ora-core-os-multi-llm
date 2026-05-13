import { RegistryService } from "./registry.service.ts";

export class CompilerService {
  static compileArtifacts(besoin: string, selectedCapabilityIds: string[]) {
    const modules = RegistryService.getModules();
    const capabilities = RegistryService.getCapabilities();
    
    const selectedCapabilities = capabilities.filter(c => selectedCapabilityIds.includes(c.id));
    const initialModuleIds = Array.from(new Set(selectedCapabilities.flatMap(c => c.mappedModules)));
    
    // Recursive dependency resolution
    const resolvedModuleIds = new Set<string>();
    const resolve = (ids: string[]) => {
      ids.forEach(id => {
        if (!resolvedModuleIds.has(id)) {
          resolvedModuleIds.add(id);
          const mod = RegistryService.getModuleById(id);
          if (mod && mod.dependencies.length > 0) {
            resolve(mod.dependencies);
          }
        }
      });
    };
    resolve(initialModuleIds);

    const selectedModules = modules.filter(m => resolvedModuleIds.has(m.id));

    // Deterministic token estimate.
    const baseTokens = 250;
    const modulesTokens = selectedModules.reduce((acc, m) => acc + m.tokenCostWeight, 0);
    const dependencyCost = selectedModules.reduce((acc, m) => acc + (m.dependencies?.length || 0) * 8, 0);
    const totalTokens = baseTokens + modulesTokens + dependencyCost;

    return {
      directPrompt: {
        tokenEstimate: totalTokens,
        grenaprompt: `ORA_CORE_OS_v2.1_EXEC {\n  INTENT="${besoin}";\n  ESSENCE_MAP=[${selectedModules.map(m => m.glyph || m.nanoEssence).join(', ')}];\n  PROTO=GRENAPROMPT_MAX;\n}\n[[${selectedModules.map(m => `${m.glyph || m.nanoEssence}::${m.publicName}`).join(' | ')}]]`,
        gpv2Minified: `[[ORA_OS_GPV2]]<${selectedModules.map(m => m.glyph || m.nanoEssence).join('::')}>⟨${besoin.slice(0, 30)}⟩`
      },
      projectMd: `# ORA_CORE_OS - Project Governance\n## Besoin Sémantique\n${besoin}\n\n## Essences ORA Incluses\n${selectedModules.map(m => `- **${m.glyph || m.nanoEssence}** (${m.publicName}) : ${m.description}`).join('\n')}\n\n## Logique d'Extraction (Essence ZIP)\nLes modules ont été compressés en essences "nano" pour maximiser la densité informationnelle sans compromettre la gouvernance.`,
      masterPreferences: `/// ORA_CORE_OS_MASTER_KERNEL ///\n- PROTOCOL: ORA_CORE_OS_v2.1\n- ACTIVE_ESSENCES: ${selectedModules.map(m => m.glyph || m.nanoEssence).join(', ')}\n- CORE_LOGIC: ACT AS EXTRACTED KERNEL FROM ORA_MODULES.\n- TARGET_BESOIN: ${besoin}.\n//////////////////////////////////////`
    };
  }

  static reflectAletheia(updateId: string, before: any) {
    const seed = `${updateId}:${JSON.stringify(before || {})}`
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const coherence = 60 + (seed % 31);
    const fluidity = 55 + ((seed * 7) % 36);
    
    return {
      reflection: "Le noyau ORA s'est transformé. La continuité sémantique est maintenue à travers l'essence Aletheia.",
      stats: { coherence, fluidity },
      status: `ALETHEIA_SYNC_${updateId.toUpperCase()}`
    };
  }

  static compileModule(name: string, description: string) {
    const seed = (name.length + description.length);
    const rarities: ('COMMON' | 'RARE' | 'EPIC' | 'EXOTIC' | 'LEGENDARY' | 'MYTHIC')[] = ['COMMON', 'RARE', 'EPIC', 'EXOTIC', 'LEGENDARY', 'MYTHIC'];
    const rarity = rarities[seed % rarities.length];
    
    const valueMultiplier = (seed % 10) + 1;
    const baseValue = rarity === 'MYTHIC' ? 5000 : rarity === 'LEGENDARY' ? 2500 : rarity === 'EXOTIC' ? 1200 : rarity === 'EPIC' ? 600 : rarity === 'RARE' ? 250 : 50;
    const marketValue = baseValue * valueMultiplier;

    // Deterministic ASCII-safe essence generation.
    const greekPrefixes = ['theta', 'beta', 'chi', 'rho', 'epsilon', 'alpha', 'eta', 'psi', 'kappa', 'omega', 'ora'];
    const prefix = greekPrefixes[seed % greekPrefixes.length];
    const suffix = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
    const essence = `${prefix}.${suffix}`;

    const complexityScore = ((seed % 100) / 10).toFixed(1);
    const demandIndex = (1.0 + (seed % 50) / 10).toFixed(1);

    // Dynamic suggested dependencies/conflicts
    const dependencies = seed % 3 === 0 ? ['ORA_CORE_OS'] : seed % 3 === 1 ? ['ora.arch'] : [];
    const conflicts = seed % 4 === 0 ? ['Legacy_Bridge'] : seed % 4 === 1 ? ['Slow_Logic'] : [];

    return { essence, rarity, marketValue, complexityScore, demandIndex, dependencies, conflicts };
  }
}
