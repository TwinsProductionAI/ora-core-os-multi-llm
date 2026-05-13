import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OraModule, Capability } from "../types/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RegistryService {
  private static modules: OraModule[] | null = null;
  private static capabilities: Capability[] | null = null;

  static getModules(): OraModule[] {
    if (!this.modules) {
      const data = fs.readFileSync(path.join(__dirname, "../data/modules.seed.json"), "utf-8");
      this.modules = JSON.parse(data);
    }
    return this.modules!;
  }

  static getCapabilities(): Capability[] {
    if (!this.capabilities) {
      const data = fs.readFileSync(path.join(__dirname, "../data/capabilities.seed.json"), "utf-8");
      this.capabilities = JSON.parse(data);
    }
    return this.capabilities!;
  }

  static getModuleById(id: string): OraModule | undefined {
    return this.getModules().find(m => m.id === id);
  }
}
