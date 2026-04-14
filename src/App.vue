<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

onLaunch(() => {
  appStore.init()
})
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
