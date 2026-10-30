import type { RequestModuleConfig } from './types';
export function validateRequestFields(fields: Record<string, string>, required: string[]): boolean {
  return required.every((key) => Boolean(fields[key]?.trim()));
}
export function assertModuleConfig(config: RequestModuleConfig): RequestModuleConfig { return config; }
