import { Plugin } from 'vite';
import resolveConfig from 'tailwindcss/resolveConfig';

export default function themePlugin(): Plugin {
  const virtualModuleId = 'virtual:theme';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'beabee-theme-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const tailwindConfig = await import('../tailwind.config');
        const fullConfig = resolveConfig(tailwindConfig);
        return (
          'export default ' +
          JSON.stringify({
            colors: fullConfig.theme.colors,
            fontFamily: fullConfig.theme.fontFamily,
          })
        );
      }
    },
  };
}
