import { ConveyorApi } from '@/lib/preload/shared'

export class AppApi extends ConveyorApi {
  version = () => this.invoke('version')

  authCheck = () => this.invoke('auth-check')

  authLogin = (masterKey: string) => this.invoke('auth-login', masterKey)

  passwordsGetAll = (userId: string) => this.invoke('passwords-get-all', userId)

  passwordsGetById = (id: number) => this.invoke('passwords-get-by-id', id)

  passwordsCreate = (
    userId: string,
    data: { title: string; username: string; password: string; url?: string; totp?: string; notes?: string }
  ) => this.invoke('passwords-create', userId, data)

  passwordsUpdate = (
    id: number,
    data: { title: string; username: string; password: string; url?: string; totp?: string; notes?: string }
  ) => this.invoke('passwords-update', id, data)

  passwordsDelete = (id: number) => this.invoke('passwords-delete', id)
}
