import type { TourProps } from 'antd'

export const guideSteps: Record<string, TourProps['steps']> = {
  'pre-select': [
    {
      title: '下一步',
      description: '点击下一步，进入选产品环节',
      target: () => document.getElementById('preselect-next-step-button')!,
    },
    {
      title: '预选进度',
      description: '这里会显示你当前总体预选进度',
      target: () => document.getElementById('preselect-progress-status')!,
    },
  ],
  'product-select': [
    {
      title: '照片筛选栏',
      description: '按“所有照片”、“已选照片”、“未选照片”分类浏览，便于快速筛选和管理。',
      target: () => document.getElementById('photo-filter-bar')!,
      placement: 'bottomRight',
    },
    {
      title: '产品栏',
      description: '选择对应的产品，自动筛选相关照片。',
      target: () => document.getElementById('product-bar')!,
      placement: 'bottomRight',
    },
    {
      title: '加入产品',
      description: '选中照片后，可一键添加至产品。',
      target: () => document.getElementById('add-to-product-button')!,
    },
    {
      title: '备注',
      description: '为照片添加备注，如修饰要求等。',
      target: () => document.getElementById('remark-button')!,
    },
    {
      title: '操作栏',
      description: '使用放大、缩小、旋转等工具调整照片显示效果。',
      target: () => document.getElementById('action-bar')!,
    },
  ],
}
