export type CurrentUser = {
  id: string
  auth0Sub: string
  firstName: string
  lastName?: string
  email?: string
}

export const CURRENT_USER_STORAGE_KEY = 'dashboard_current_user'
