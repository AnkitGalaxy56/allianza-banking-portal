import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getErrorMessage } from '@/services/api/apiError';
import { requestHandlingService, type RequestHandlingModule } from '@/services/request-handling.service';

export type ApiRequestStatus = 'Pending' | 'Authorised' | 'Rejected';

/** One request as returned by the portal API (see TABLE_INSTRUCTIONS.md). */
export interface ApiRequestRecord {
  id: string;
  /** Human friendly number such as "PAY-000015". Falls back to id. */
  displayId?: string;
  status: ApiRequestStatus;
  submittedOn: string;
  /** False when the signed-in user is the maker (or last editor): maker-checker rule. */
  canVerify?: boolean;
  canEdit?: boolean;
  fields: Record<string, string>;
}

/** Field level messages sent by the server for a rejected create / edit. */
export function serverFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError(error)) {
    const errors = (error.response?.data as { errors?: Record<string, string> } | undefined)?.errors;
    if (errors) return errors;
  }
  return {};
}

/** Flat shape used by the older pages: { id, requestStatus, ...fields }. */
export function flatten(record: ApiRequestRecord): Record<string, any> {
  return {
    ...record.fields,
    id: record.id,
    displayId: record.displayId ?? record.id,
    requestStatus: record.status,
    submittedOn: record.submittedOn,
    canVerify: record.canVerify,
    canEdit: record.canEdit,
  };
}

/**
 * Loads and changes the requests of one module through the API.
 * The list is masked (account numbers); call getOne(id) before showing or editing a request.
 */
export function useRequestModule(module: RequestHandlingModule) {
  const [records, setRecords] = useState<ApiRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const result = await requestHandlingService.list<ApiRequestRecord>(module, { pageSize: 200 });
      setRecords(Array.isArray(result) ? result : result.items);
      setError('');
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to load requests.'));
    } finally {
      setLoading(false);
    }
  }, [module]);

  useEffect(() => {
    setLoading(true);
    void reload();
  }, [reload]);

  const getOne = useCallback((id: string) => requestHandlingService.get<ApiRequestRecord>(module, id), [module]);

  const create = useCallback(async (fields: Record<string, unknown>) => {
    const record = await requestHandlingService.create<ApiRequestRecord>(module, fields as unknown as Partial<ApiRequestRecord>);
    await reload();
    return record;
  }, [module, reload]);

  const update = useCallback(async (id: string, fields: Record<string, unknown>) => {
    const record = await requestHandlingService.update<ApiRequestRecord>(module, id, fields as unknown as Partial<ApiRequestRecord>);
    await reload();
    return record;
  }, [module, reload]);

  const decide = useCallback(async (id: string, status: 'Authorised' | 'Rejected', remarks?: string) => {
    const record = await requestHandlingService.decide<ApiRequestRecord>(module, id, status, remarks);
    await reload();
    return record;
  }, [module, reload]);

  return { records, loading, error, reload, getOne, create, update, decide };
}
