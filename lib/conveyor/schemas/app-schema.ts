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
      id: z.number().optional(),
      uuid: z.string().optional(),
      master_key: z.string().optional(),
    }),
  },
  'auth-login': {
    args: z.tuple([z.string()]),
    return: z.boolean(),
  },
  'passwords-get-all': {
    args: z.tuple([z.string()]),
    return: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        username: z.string(),
        password: z.string(),
        url: z.string(),
        totp: z.string(),
        notes: z.string(),
        created_at: z.number(),
        updated_at: z.number(),
      })
    ),
  },
  'passwords-get-by-id': {
    args: z.tuple([z.number()]),
    return: z.object({
      id: z.number(),
      title: z.string(),
      username: z.string(),
      password: z.string(),
      url: z.string(),
      totp: z.string(),
      notes: z.string(),
      created_at: z.number(),
      updated_at: z.number(),
    }),
  },
  'passwords-create': {
    args: z.tuple([
      z.string(),
      z.object({
        title: z.string(),
        username: z.string(),
        password: z.string(),
        url: z.string().optional(),
        totp: z.string().optional(),
        notes: z.string().optional(),
      }),
    ]),
    return: z.number(),
  },
  'passwords-update': {
    args: z.tuple([
      z.number(),
      z.object({
        title: z.string(),
        username: z.string(),
        password: z.string(),
        url: z.string().optional(),
        totp: z.string().optional(),
        notes: z.string().optional(),
      }),
    ]),
    return: z.boolean(),
  },
  'passwords-delete': {
    args: z.tuple([z.number()]),
    return: z.boolean(),
  },
}
