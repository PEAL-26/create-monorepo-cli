/**
 * Normaliza o nome de um app para ser válido em diretórios e package.json
 * - Remove espaços extras
 * - Substitui espaços internos por "-"
 * - Converte tudo para minúsculo
 * - Remove caracteres especiais inválidos
 */
export function sanitizeAppName(name) {
  return name
    .trim() 
    .toLowerCase() 
    .replace(/\s+/g, "-") 
    .replace(/[^a-z0-9-_]/g, ""); 
}
