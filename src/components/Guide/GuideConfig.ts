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
    {
      title: '缩略图栏切换',
      description: '点击此按钮可显示或隐藏缩略图栏，方便你更好地浏览和选择照片',
      target: () => document.getElementById('toggle-thumbnail-bar-button')!,
    },
    {
      title: '单张视图按钮',
      description: '点击此按钮可切换到单张视图模式，专注查看每张照片的细节',
      target: () => document.getElementById('single-view-button')!,
    },
    {
      title: '多图对比视图按钮',
      description: '点击此按钮可切换到对比视图模式，最多同时查看4张照片，便于比较和选择',
      target: () => document.getElementById('compare-view-button')!,
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
