import { BROWSER } from "esm-env";
import { pluginModuleType } from "./types";
import type { PluginAsset, PluginModule, PluginComponent } from "./types";

export const loadScript = async (script: string) => {
  const blob = new Blob([script], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  const module = await import(/* @vite-ignore */ url);
  URL.revokeObjectURL(url);
  const parsed = await pluginModuleType.safeParseAsync(module);

  return parsed;
};

export const loadModules = async (assets: PluginAsset[]): Promise<PluginModule[]> => {
  return !BROWSER
    ? []
    : (async () => {
        if (!BROWSER) throw Error("Plugins should not be evaluated on the server");
        return (await Promise.all(
          assets
            .map(async (asset) => {
              const { script, ...rest } = asset;

              const parsed = await loadScript(script);

              if (!parsed.success) {
                console.error(
                  `An installed module (${rest.id}:${rest.name} - ${rest.version}) produced an error. This may be due to it being made for an older version of breakfast or manual interference.`,
                );
                console.error(parsed.error);
                return;
              }

              return parsed.data;
            })
            .filter((a) => a !== undefined),
        )) as PluginModule[];
      })();
};

export const loadComponents = async (
  modules: PluginModule[],
): Promise<Map<string, PluginComponent>> => {
  return !BROWSER
    ? new Map()
    : (async () => {
        if (!BROWSER) throw Error("Plugins should not be evaluated on the server");
        if (!modules) throw Error("Modules not loaded yet");
        return new Map(
          await Promise.all(
            modules
              .map((module) =>
                module.components.map(
                  (component) =>
                    [
                      `${module.id}|${component.id}`,
                      {
                        module: {
                          id: module.id,
                          name: module.name,
                        },
                        ...component,
                      },
                    ] as const,
                ),
              )
              .reduce((pv, cv) => [...pv, ...cv], []),
          ),
        );
      })();
};
