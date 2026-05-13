import { RegistryService } from "./registry.service.ts";

export class AnalyzerService {
  static analyzeNeeds(text: string) {
    const lowerText = text.toLowerCase();
    const modules = RegistryService.getModules();
    const capabilities = RegistryService.getCapabilities();

    // 1. Primary Semantic Detection
    const primaryCaps = capabilities.filter(cap => 
      cap.keywords.some(keyword => lowerText.includes(keyword))
    );

    const primaryModuleIds = Array.from(new Set(primaryCaps.flatMap(c => c.mappedModules)));
    const primaryModules = modules.filter(m => primaryModuleIds.includes(m.id));

    // 2. Reinforcement Logic
    const reinforcementModules = modules.filter(m => 
      m.category === 'Reinforcement' && (
        primaryModules.some(p => m.dependencies.includes(p.id)) || 
        (m.tags.includes('shield') && (lowerText.includes('audit') || lowerText.includes('strict') || lowerText.includes('rigueur'))) ||
        (m.tags.includes('focus') && text.length > 100)
      )
    );

    // 3. Exotic Synthesis
    const exoticModules = modules.filter(m => 
      m.category === 'Exotic' && (
        lowerText.includes('exotique') || 
        lowerText.includes('abstrait') || 
        lowerText.includes('quantum') || 
        lowerText.includes('innovation') ||
        (primaryCaps.length >= 3 && text.length > 50)
      )
    );

    // 4. Specific Module Triggers
    const specificModules = modules.filter(m => {
      if (m.id === 'm25' && (lowerText.includes('strateg') || lowerText.includes('decision') || lowerText.includes('risque') || lowerText.includes('scorecard'))) return true;
      if (m.id === 'm26' && (lowerText.includes('creati') || lowerText.includes('ideation') || lowerText.includes('concept') || lowerText.includes('narration'))) return true;
      if (m.id === 'm20' && (lowerText.includes('persona') || lowerText.includes('profil') || lowerText.includes('role') || lowerText.includes('comportement'))) return true;
      if (m.id === 'm27' && (lowerText.includes('visuel') || lowerText.includes('storyboard') || lowerText.includes('image') || lowerText.includes('video'))) return true;
      if (m.id === 'm28' && (lowerText.includes('business') || lowerText.includes('vente') || lowerText.includes('persuasion') || lowerText.includes('commerce') || lowerText.includes('pme'))) return true;
      if (m.id === 'm13' && (lowerText.includes('os') || lowerText.includes('kernel') || lowerText.includes('compiler'))) return true;
      if (m.id === 'm22' && (lowerText.includes('primordia') || lowerText.includes('truth') || lowerText.includes('vérité'))) return true;
      return false;
    });

    const fullDetected = [...primaryModules, ...reinforcementModules, ...exoticModules, ...specificModules];
    const uniqueDetected = fullDetected.filter((m, i, self) => i === self.findIndex(t => t.id === m.id));

    const recommendedCapabilityIds = Array.from(new Set([
      'cap_foundation', // Always recommend foundation
      ...primaryCaps.map(c => c.id),
      ...capabilities.filter(cap => 
        cap.mappedModules.some(mid => [...reinforcementModules, ...exoticModules, ...specificModules].map(xm => xm.id).includes(mid))
      ).map(c => c.id)
    ]));

    return {
      detectedModules: uniqueDetected,
      primaryCaps,
      reinforcementModules,
      exoticModules,
      specificModules,
      recommendedCapabilityIds
    };
  }
}
