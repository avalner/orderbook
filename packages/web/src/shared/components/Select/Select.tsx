import ReactSelect from 'react-select';
import React, { useMemo } from 'react';
import { PropsOf } from '@emotion/react/types/helper';
import { StylesConfig } from 'react-select/src/styles';
import { useTheme, Theme } from '@emotion/react';
import { FormatOptionLabelMeta } from 'react-select/src/Select';
import { lighten } from 'polished';

export type NumericValueOption = {
  value: number;
  label: string;
};

function getCustomStyles<T, M extends boolean>(inputStyles: StylesConfig<T, M>, theme: Theme): StylesConfig<T, M> {
  const selectBackgroundColor = theme.palette.panelBackgroundColor;
  const selectionColor = lighten(0.1, theme.palette.panelBackgroundColor);
  const highlightColor = lighten(0.03, theme.palette.panelBackgroundColor);
  const textColor = theme.palette.text.primary;
  const height = theme.control.height;
  const minWidth = theme.controls.select.minWidth;

  return {
    container: provided => ({ ...provided, minWidth }),
    control: provided => ({
      ...provided,
      background: selectBackgroundColor,
      border: 'none',
      minHeight: height,
      height: height,
      boxShadow: 'none',
    }),
    valueContainer: provided => ({
      ...provided,
      height: height,
      padding: '0 6px',
    }),
    input: provided => ({
      ...provided,
      margin: '0px',
      border: 'none',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: provided => ({
      ...provided,
      height: height,
    }),
    menu: provided => ({
      ...provided,
      background: selectBackgroundColor,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? selectionColor : state.isFocused ? highlightColor : selectBackgroundColor,
      ':active': {
        ...provided[':active'],
        backgroundColor: state.isSelected || state.isFocused ? selectionColor : selectBackgroundColor,
      },
    }),
    singleValue: provided => ({
      ...provided,
      color: textColor,
    }),
    ...inputStyles,
  };
}

const formatOptionLabel =
  (selectedValuePrefix: string) =>
  (option: any, labelMeta: FormatOptionLabelMeta<NumericValueOption, false>): React.ReactNode => {
    return labelMeta.context === 'value' && selectedValuePrefix
      ? `${selectedValuePrefix} ${option.label}`
      : option.label;
  };

const Select: React.FC<PropsOf<typeof ReactSelect> & { selectedValuePrefix?: string }> = ({
  styles,
  selectedValuePrefix,
  ...other
}) => {
  const theme = useTheme();
  const mergedStyles = useMemo(() => getCustomStyles(styles, theme), [styles, theme]);

  return <ReactSelect styles={mergedStyles} formatOptionLabel={formatOptionLabel(selectedValuePrefix)} {...other} />;
};

export default React.memo(Select);
