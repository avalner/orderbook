import Select, { NumericValueOption } from './Select';
import { PropsOf } from '@emotion/react/types/helper';

const options: NumericValueOption[] = [
  { value: 0.5, label: '0.5' },
  { value: 1.0, label: '1.0' },
  { value: 1.5, label: '1.5' },
];

export default {
  title: 'Design System/Select',
  component: Select,
};

const Template = args => <Select {...args} />;

export const Default = Template.bind({});

Default.args = {
  selectedValuePrefix: 'Group',
  defaultValue: options[0],
  options,
  styles: {
    container: provided => ({ ...provided, width: 120 }),
  },
} as PropsOf<typeof Select>;
