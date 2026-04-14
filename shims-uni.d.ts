/// <reference types='@dcloudio/types' />
import 'vue'

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance

  interface ComponentCustomOptions extends Hooks {}

  interface GlobalComponents {
    TButton: typeof import('tdesign-uniapp/button/button.vue').default
    TSwiper: typeof import('tdesign-uniapp/swiper/swiper.vue').default
    TSwiperNav: typeof import('tdesign-uniapp/swiper-nav/swiper-nav.vue').default
    TCell: typeof import('tdesign-uniapp/cell/cell.vue').default
    TCellGroup: typeof import('tdesign-uniapp/cell-group/cell-group.vue').default
    TPopup: typeof import('tdesign-uniapp/popup/popup.vue').default
  }
}
