import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs, configureVueProject } from '@vue/eslint-config-typescript'

// Configure Vue project settings
configureVueProject({
  tsSyntaxInTemplates: true,
  allowComponentTypeUnsafety: true,
  rootDir: import.meta.dirname,
})

export default defineConfigWithVueTs(
  // Vue recommended configuration
  pluginVue.configs['flat/essential'],
  // TypeScript recommended configuration
  vueTsConfigs.recommendedTypeChecked,
  {
    // Language options configuration
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
      }
    },
    // Rules configuration
    rules: {
      // Type imports configuration
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
        disallowTypeAnnotations: true
      }],
      // Unused expressions configuration
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],
      // Unused variables configuration
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      // This alias configuration
      '@typescript-eslint/no-this-alias': ['error', {
        allowDestructuring: true,
        allowedNames: ['self', 'vm']
      }]
    }
  }
)

// Ignore patterns (replaces both ignorePatterns and .eslintignore)
export const ignores = ['dist/**', 'node_modules/**']