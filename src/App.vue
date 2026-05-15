<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useAppStore, useUserStore } from '@/stores'

const appStore = useAppStore()
const userStore = useUserStore()

const DEFAULT_STORE_ID = 15

onLaunch((options) => {
  console.log('[App.onLaunch] 小程序启动参数:', options)
  appStore.init()
  userStore.init()
  console.log('[App.onLaunch] init 后 effectiveStoreId:', userStore.effectiveStoreId)

  // 普通链接二维码通过 q 参数传递
  if (options?.query?.q) {
    const url = decodeURIComponent(options.query.q)
    console.log('[App.onLaunch] 普通链接二维码 q 参数:', url)
    const storeId = parseStoreIdFromUrl(url)
    console.log('[App.onLaunch] 解析出的 storeId:', storeId)
    if (storeId !== null) {
      userStore.setQrcodeStoreId(storeId)
      console.log('[App.onLaunch] 设置后 effectiveStoreId:', userStore.effectiveStoreId)
    }
  }

  // 小程序码通过 scene 参数传递
  if (options?.scene) {
    console.log('[App.onLaunch] 小程序码 scene 参数:', options.scene)
    const storeId = parseStoreIdFromScene(options.scene)
    console.log('[App.onLaunch] 解析出的 storeId:', storeId)
    if (storeId !== null) {
      userStore.setQrcodeStoreId(storeId)
      console.log('[App.onLaunch] 设置后 effectiveStoreId:', userStore.effectiveStoreId)
    }
  }

  console.log('[App.onLaunch] 最终 effectiveStoreId:', userStore.effectiveStoreId)
})

// 解析普通链接二维码 URL 中的门店ID
// 例如: https://rfsn.yywk.net/store/?storeId=15
function parseStoreIdFromUrl(url: string): number | null {
  try {
    const urlObj = new URL(url)
    const storeId = urlObj.searchParams.get('storeId')
    if (storeId) {
      const id = Number(storeId)
      if (!isNaN(id)) {
        return id
      }
    }
  } catch (e) {
    console.warn('解析二维码URL失败:', e)
  }
  return null
}

function parseStoreIdFromScene(scene: string | undefined): number | null {
  if (!scene) return null

  try {
    const decoded = decodeURIComponent(scene)
    // 支持格式: storeId=15 或 直接是数字 15
    const match = decoded.match(/(?:storeId=)?(\d+)/)
    if (match?.[1]) {
      const storeId = Number(match[1])
      // 排除微信开发者工具的默认 scene 值 1001
      if (storeId === 1001) {
        console.log('[parseStoreIdFromScene] 排除默认 scene 值 1001')
        return null
      }
      return storeId
    }
  } catch (e) {
    console.warn('解析小程序码 scene 参数失败:', e)
  }

  return null
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
@import '@/static/iconfont/iconfont.css';

page {
  background: $page-bg;
  color: $text-primary;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

view,
text,
button {
  box-sizing: border-box;
}

button::after {
  border: none;
}

.iconfont {
  font-family: 'iconfont' !important;
}
</style>
