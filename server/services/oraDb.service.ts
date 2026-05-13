import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  InstallationRecipe,
  InstallationRecipeRegistry,
  OraDbCatalog,
  OraDbFile,
  OraPack,
  OraPackRegistry,
} from "../types/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data/ora-agent-db");

type FileFilters = {
  q?: string;
  kind?: string;
  extension?: string;
  packId?: string;
};

export class OraDbService {
  private static catalog: OraDbCatalog | null = null;
  private static packRegistry: OraPackRegistry | null = null;
  private static recipeRegistry: InstallationRecipeRegistry | null = null;

  private static readJson<T>(filename: string): T {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw.replace(/^\uFEFF/, "")) as T;
  }

  static getCatalog(): OraDbCatalog {
    if (!this.catalog) {
      this.catalog = this.readJson<OraDbCatalog>("ora_agent_modulaire.catalog.json");
    }
    return this.catalog;
  }

  static getPackRegistry(): OraPackRegistry {
    if (!this.packRegistry) {
      this.packRegistry = this.readJson<OraPackRegistry>("ora_agent_modulaire.packs.json");
    }
    return this.packRegistry;
  }

  static getRecipeRegistry(): InstallationRecipeRegistry {
    if (!this.recipeRegistry) {
      this.recipeRegistry = this.readJson<InstallationRecipeRegistry>("installation_recipes.json");
    }
    return this.recipeRegistry;
  }

  static getSummary() {
    const catalog = this.getCatalog();
    const packs = this.getPackRegistry();
    const recipes = this.getRecipeRegistry();

    const kinds = Array.from(new Set(catalog.files.map((file) => file.kind))).sort();
    const extensions = Array.from(new Set(catalog.files.map((file) => file.extension))).sort();

    return {
      id: catalog.id,
      version: catalog.version,
      generatedAt: catalog.generated_at,
      source: catalog.source,
      excludes: catalog.excludes,
      fileCount: catalog.file_count,
      packCount: packs.packs.length,
      recipeCount: recipes.recipes.length,
      kinds,
      extensions,
    };
  }

  static listFiles(filters: FileFilters = {}): OraDbFile[] {
    let files = [...this.getCatalog().files];

    if (filters.packId) {
      const pack = this.getPackById(filters.packId);
      const allowedIds = new Set(pack?.file_ids || []);
      files = files.filter((file) => allowedIds.has(file.id));
    }

    if (filters.kind && filters.kind !== "ALL") {
      files = files.filter((file) => file.kind === filters.kind);
    }

    if (filters.extension && filters.extension !== "ALL") {
      files = files.filter((file) => file.extension === filters.extension);
    }

    if (filters.q) {
      const needle = filters.q.toLowerCase();
      files = files.filter((file) =>
        [file.id, file.path, file.name, file.kind, file.extension]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
    }

    return files;
  }

  static getFileById(id: string): OraDbFile | undefined {
    return this.getCatalog().files.find((file) => file.id === id);
  }

  static getPacks(): OraPack[] {
    return this.getPackRegistry().packs;
  }

  static getPackById(id: string): OraPack | undefined {
    return this.getPackRegistry().packs.find((pack) => pack.id === id);
  }

  static getRecipes(): InstallationRecipe[] {
    return this.getRecipeRegistry().recipes;
  }

  static getRecipeById(id: string): InstallationRecipe | undefined {
    return this.getRecipeRegistry().recipes.find((recipe) => recipe.id === id);
  }
}
