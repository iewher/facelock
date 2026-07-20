import { z } from 'zod'

export const appIpcSchema = {
  version: {
    args: z.tuple([]),
    return: z.string(),
  },
  'auth-check': {
    args: z.tuple([]),
    return: z.object({
      exists: z.boolean(),
      uuid: z.string().optional(),
      master_key: z.string().optional(),
    }),
  },
  'auth-login': {
    args: z.tuple([z.string()]),
    return: z.boolean(),
  },
}
