import { ConveyorApi } from '@/lib/preload/shared'

export class AppApi extends ConveyorApi {
  version = () => this.invoke('version')

  authCheck = () => this.invoke('auth-check')

  authLogin = (masterKey: string) => this.invoke('auth-login', masterKey)
}
