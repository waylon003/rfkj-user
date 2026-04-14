import type {
  RankingDataset,
  RankingMachineType,
  RankingPageData,
  RankingTab
} from '@/services/ranking/types'

function createDataset(
  myRank: string,
  note: string,
  podium: Array<{ rank: number; name: string; value: string; unit: string; trophy: 'secondary' | 'champion' | 'third'; baseLabel: string }>,
  list: Array<{ rank: number; name: string; value: string; unit: string; avatarClass: 'a' | 'b' | 'c' }>
): RankingDataset {
  return {
    myRank,
    note,
    podium: podium.map(item => ({
      ...item,
      avatar: item.name.slice(0, 1)
    })),
    list: list.map(item => ({
      ...item,
      avatar: item.name.slice(0, 1)
    }))
  }
}

const rankings: Record<RankingTab, Record<RankingMachineType, RankingDataset>> = {
  machine: {
    entertainment: createDataset(
      '#12',
      '按游玩次数排序',
      [
        { rank: 2, name: '音速摩托', value: '9300', unit: '次', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '星际战车', value: '9800', unit: '次', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '疾风投篮', value: '9000', unit: '次', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '街机霸王', value: '8500', unit: '次', avatarClass: 'a' },
        { rank: 5, name: '雷霆飞车', value: '8400', unit: '次', avatarClass: 'b' },
        { rank: 6, name: '音浪鼓王', value: '8300', unit: '次', avatarClass: 'c' }
      ]
    ),
    claw: createDataset(
      '#8',
      '按游玩次数排序',
      [
        { rank: 2, name: '甜梦熊屋', value: '7600', unit: '次', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '奇趣抓抓乐', value: '8200', unit: '次', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '奶糖星球', value: '7300', unit: '次', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '萌爪乐园', value: '7100', unit: '次', avatarClass: 'a' },
        { rank: 5, name: '棉花仓库', value: '6980', unit: '次', avatarClass: 'b' },
        { rank: 6, name: '泡泡宝藏屋', value: '6820', unit: '次', avatarClass: 'c' }
      ]
    ),
    gashapon: createDataset(
      '#15',
      '按游玩次数排序',
      [
        { rank: 2, name: '潮玩盲盒站', value: '5200', unit: '次', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '宇宙扭蛋局', value: '5480', unit: '次', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '彩虹胶囊仓', value: '5070', unit: '次', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '机甲补给箱', value: '4930', unit: '次', avatarClass: 'a' },
        { rank: 5, name: '星愿扭蛋屋', value: '4880', unit: '次', avatarClass: 'b' },
        { rank: 6, name: '限定惊喜箱', value: '4700', unit: '次', avatarClass: 'c' }
      ]
    ),
    pinball: createDataset(
      '#5',
      '按游玩次数排序',
      [
        { rank: 2, name: '火焰弹珠台', value: '6800', unit: '次', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '霓虹弹射王', value: '7050', unit: '次', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '银河碰碰乐', value: '6590', unit: '次', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '极限冲分台', value: '6480', unit: '次', avatarClass: 'a' },
        { rank: 5, name: '闪电弹珠阵', value: '6330', unit: '次', avatarClass: 'b' },
        { rank: 6, name: '回旋发射器', value: '6200', unit: '次', avatarClass: 'c' }
      ]
    )
  },
  points: {
    entertainment: createDataset(
      '#10',
      '按赚取积分排序',
      [
        { rank: 2, name: '音速摩托', value: '12600', unit: '积分', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '星际战车', value: '13280', unit: '积分', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '疾风投篮', value: '11950', unit: '积分', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '街机霸王', value: '11400', unit: '积分', avatarClass: 'a' },
        { rank: 5, name: '雷霆飞车', value: '10980', unit: '积分', avatarClass: 'b' },
        { rank: 6, name: '音浪鼓王', value: '10620', unit: '积分', avatarClass: 'c' }
      ]
    ),
    claw: createDataset(
      '#6',
      '按赚取积分排序',
      [
        { rank: 2, name: '甜梦熊屋', value: '9800', unit: '积分', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '奇趣抓抓乐', value: '10320', unit: '积分', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '奶糖星球', value: '9450', unit: '积分', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '萌爪乐园', value: '9180', unit: '积分', avatarClass: 'a' },
        { rank: 5, name: '棉花仓库', value: '8960', unit: '积分', avatarClass: 'b' },
        { rank: 6, name: '泡泡宝藏屋', value: '8750', unit: '积分', avatarClass: 'c' }
      ]
    ),
    gashapon: createDataset(
      '#18',
      '按赚取积分排序',
      [
        { rank: 2, name: '潮玩盲盒站', value: '6400', unit: '积分', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '宇宙扭蛋局', value: '6880', unit: '积分', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '彩虹胶囊仓', value: '6210', unit: '积分', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '机甲补给箱', value: '6080', unit: '积分', avatarClass: 'a' },
        { rank: 5, name: '星愿扭蛋屋', value: '5920', unit: '积分', avatarClass: 'b' },
        { rank: 6, name: '限定惊喜箱', value: '5800', unit: '积分', avatarClass: 'c' }
      ]
    ),
    pinball: createDataset(
      '#4',
      '按赚取积分排序',
      [
        { rank: 2, name: '火焰弹珠台', value: '8900', unit: '积分', trophy: 'secondary', baseLabel: '亚军' },
        { rank: 1, name: '霓虹弹射王', value: '9360', unit: '积分', trophy: 'champion', baseLabel: '冠军' },
        { rank: 3, name: '银河碰碰乐', value: '8720', unit: '积分', trophy: 'third', baseLabel: '季军' }
      ],
      [
        { rank: 4, name: '极限冲分台', value: '8590', unit: '积分', avatarClass: 'a' },
        { rank: 5, name: '闪电弹珠阵', value: '8420', unit: '积分', avatarClass: 'b' },
        { rank: 6, name: '回旋发射器', value: '8300', unit: '积分', avatarClass: 'c' }
      ]
    )
  }
}

export function getRankingPageData(): RankingPageData {
  return {
    tabs: [
      { label: '机台排名', value: 'machine' },
      { label: '积分排名', value: 'points' }
    ],
    machineTypes: [
      { label: '娱乐机', value: 'entertainment' },
      { label: '娃娃机', value: 'claw' },
      { label: '扭蛋机', value: 'gashapon' },
      { label: '弹珠机', value: 'pinball' }
    ],
    rankings
  }
}
