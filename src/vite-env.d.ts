//./vite-env.d.ts

// Importa los tipos de VITE
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
// Extiende la interfaz ImportMeta para que incluya una propiedad llamada env 
// de tipo ImportMetaEnv
interface ImportMeta {
  readonly env: ImportMetaEnv;
}