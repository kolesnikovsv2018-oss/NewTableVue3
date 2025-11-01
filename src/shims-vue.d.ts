declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Use Record<string, unknown> and unknown to avoid lint rules complaining about `{}` and `any` in declaration files
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
