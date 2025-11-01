// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'

// Minimal ESLint configuration for Vite + Vue 3 + TypeScript
configureVueProject({
  tsSyntaxInTemplates: true,
  allowComponentTypeUnsafety: true,
  rootDir: import.meta.dirname,
})

export default defineConfigWithVueTs(
  // use plugin-vue flat config and the recommended type-checked rules for Vue + TS
  pluginVue.configs['flat/essential'],
  // use recommended type-checked config for stricter, type-aware linting
  vueTsConfigs.recommendedTypeChecked
)

// Ignore build/artifact folders (replaces deprecated .eslintignore)
export const ignores = ['dist/**', 'node_modules/**']