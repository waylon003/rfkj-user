export type PublicAction = 'select-store' | 'feedback' | 'service'

export function handlePublicAction(action: PublicAction) {
  if (action === 'select-store') {
    uni.navigateTo({ url: '/pages/home/store-select' })
    return
  }

  if (action === 'feedback') {
    uni.showToast({
      title: '帮助反馈入口待接入',
      icon: 'none'
    })
    return
  }

  uni.showToast({
    title: '客服电话：400-800-8888',
    icon: 'none'
  })
}
