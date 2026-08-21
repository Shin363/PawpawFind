import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectableChip } from './SelectableChip'

const meta = {
  title: 'UI/SelectableChip',
  component: SelectableChip,
  tags: ['autodocs'],
  args: {
    children: '강아지',
    selected: false,
  },
} satisfies Meta<typeof SelectableChip>

export default meta
type Story = StoryObj<typeof meta>

export const Unselected = {} satisfies Story

export const Selected = {
  args: {
    selected: true,
  },
} satisfies Story

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story

export const States = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <SelectableChip selected={false}>전체</SelectableChip>
      <SelectableChip selected>보호소</SelectableChip>
      <SelectableChip disabled selected={false}>
        목격 제보
      </SelectableChip>
    </div>
  ),
} satisfies Story
