export const APP_CONFIG = {
  appName: '如风科技',
  appId: 'wx5f393e2dce4b78dd',
  useMock: true,
  mockDelay: 180,
  apiBaseUrl: '',
  authUseReal: true,
  authBaseUrl: 'https://rfsn.yywk.net',
  verifyCodeApiKey: import.meta.env.VITE_VERIFY_CODE_API_KEY || ''
} as const

export const EXCHANGE_RULES = {
  ticketToPointRate: 10,
  pointToCoinRate: 5
} as const
