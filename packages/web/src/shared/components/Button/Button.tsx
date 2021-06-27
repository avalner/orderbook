import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Fragment } from 'react';
import { easing } from '../../animation';
import { darken, rgba } from 'polished';
import { PropsOf } from '@emotion/react/types/helper';

const Text = styled.span`
  display: inline-block;
  vertical-align: top;
`;

const Loading = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  opacity: 0;
`;

export type ButtonAppearance = 'primary' | 'primaryOutline' | 'secondary' | 'secondaryOutline';
export type ButtonSize = 'small' | 'medium';

export type ButtonProps = {
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
  clickable?: boolean;
  containsIcon?: boolean;
  color?: string;
  appearance?: ButtonAppearance;
};

const StyledButton = styled.button<ButtonProps>`
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: ${props => (props.size === 'small' ? '8px 16px' : '13px 20px')};
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: all 150ms ease-out;
  transform: translate3d(0, 0, 0);
  vertical-align: top;
  white-space: nowrap;
  user-select: none;
  opacity: 1;
  background: transparent;

  font-size: ${p => (p.size === 'small' ? p.theme.typography.size.s1 : p.theme.typography.size.s2)}px;
  font-weight: ${p => p.theme.typography.fontWeightBold};
  line-height: 1;

  ${p =>
    !p.isLoading &&
    css`
      &:hover {
        transform: translate3d(0, -2px, 0);
        box-shadow: rgba(0, 0, 0, 0.2) 0 2px 6px 0;
      }

      &:active {
        transform: translate3d(0, 0, 0);
      }

      &:focus {
        box-shadow: ${rgba(p.theme.palette.primary, 0.4)} 0 1px 9px 2px;
      }

      &:focus:hover {
        box-shadow: ${rgba(p.theme.palette.primary, 0.2)} 0 8px 18px 0px;
      }
    `}

  [data-text] {
    transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
    transition: transform 700ms ${easing.rubber};
    opacity: 1;
  }

  [data-loading] {
    transform: translate3d(0, 100%, 0);
  }

  svg {
    height: ${props => (props.size === 'small' ? '14' : '16')}px;
    width: ${props => (props.size === 'small' ? '14' : '16')}px;
    vertical-align: top;
    margin-right: ${props => (props.size === 'small' ? '4' : '6')}px;
    margin-top: ${props => (props.size === 'small' ? '-1' : '-2')}px;
    margin-bottom: ${props => (props.size === 'small' ? '-1' : '-2')}px;

    /* Necessary for js mouse events to not glitch out when hovering on svgs */
    pointer-events: none;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed !important;
      opacity: 0.5;
      &:hover {
        transform: none;
      }
    `}

  ${props =>
    !props.clickable &&
    css`
      cursor: default !important;
      pointer-events: none;
      &:hover {
        transform: none;
      }
    `}

  ${props =>
    props.isLoading &&
    css`
      cursor: progress !important;
      opacity: 0.7;

      [data-loading] {
        transform: translate3d(0, -50%, 0);
        opacity: 1;
      }

      [data-text] {
        transform: scale3d(0, 0, 1) translate3d(0, -100%, 0);
        opacity: 0;
      }

      transition: none;
      transform: none;
    `}

  ${p =>
    p.containsIcon &&
    css`
      svg {
        display: block;
        margin: 0;
      }
      padding: ${p.size === 'small' ? '7' : '12'}px;
    `}

  ${p =>
    p.appearance === 'primary' &&
    css`
      background-color: ${p.color || p.theme.palette.primary};
      color: ${p.theme.palette.monochrome.lightest};

      ${!p.isLoading &&
      css`
        &:hover {
          background: ${darken(0.05, p.color || p.theme.palette.primary)};
        }
        &:active {
          box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;
        }
        &:focus {
          box-shadow: ${rgba(p.color || p.theme.palette.primary, 0.4)} 0 1px 9px 2px;
        }
        &:focus:hover {
          box-shadow: ${rgba(p.color || p.theme.palette.primary, 0.2)} 0 8px 18px 0px;
        }
      `}
    `}

  ${p =>
    p.appearance === 'secondary' &&
    css`
      background-color: ${p.color || p.theme.palette.secondary};
      color: ${p.theme.palette.monochrome.lightest};

      ${!p.isLoading &&
      css`
        &:hover {
          background: ${darken(0.05, p.color || p.theme.palette.secondary)};
        }
        &:active {
          box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;
        }
        &:focus {
          box-shadow: ${rgba(p.color || p.theme.palette.secondary, 0.4)} 0 1px 9px 2px;
        }
        &:focus:hover {
          box-shadow: ${rgba(p.color || p.theme.palette.secondary, 0.2)} 0 8px 18px 0px;
        }
      `}
    `}

  ${p =>
    p.appearance === 'primaryOutline' &&
    css`
      box-shadow: ${p.color || p.theme.palette.primary} 0 0 0 1px inset;
      color: ${p.color || p.theme.palette.primary};

      &:hover {
        box-shadow: ${p.color || p.theme.palette.primary} 0 0 0 1px inset;
        background: transparent;
      }

      &:active {
        background-color: ${p.color || p.theme.palette.primary};
        box-shadow: ${p.color || p.theme.palette.primary} 0 0 0 1px inset;
        color: ${p.theme.palette.monochrome.lightest};
      }
      &:focus {
        box-shadow: ${p.color || p.theme.palette.primary} 0 0 0 1px inset,
          ${rgba(p.color || p.theme.palette.primary, 0.4)} 0 1px 9px 2px;
      }
      &:focus:hover {
        box-shadow: ${p.color || p.theme.palette.primary} 0 0 0 1px inset,
          ${rgba(p.color || p.theme.palette.primary, 0.2)} 0 8px 18px 0px;
      }
    `};

  ${p =>
    p.appearance === 'secondaryOutline' &&
    css`
      box-shadow: ${p.color || p.theme.palette.secondary} 0 0 0 1px inset;
      color: ${p.color || p.theme.palette.secondary};

      &:hover {
        box-shadow: ${p.color || p.theme.palette.secondary} 0 0 0 1px inset;
        background: transparent;
      }

      &:active {
        background: ${p.color || p.theme.palette.secondary};
        box-shadow: ${p.color || p.theme.palette.secondary} 0 0 0 1px inset;
        color: ${p.theme.palette.monochrome.lightest};
      }
      &:focus {
        box-shadow: ${p.color || p.theme.palette.secondary} 0 0 0 1px inset,
          ${rgba(p.color || p.theme.palette.secondary, 0.4)} 0 1px 9px 2px;
      }
      &:focus:hover {
        box-shadow: ${p.color || p.theme.palette.secondary} 0 0 0 1px inset,
          ${rgba(p.color || p.theme.palette.secondary, 0.2)} 0 8px 18px 0px;
      }
    `};
`;

const ButtonInternal: React.FC<PropsOf<typeof StyledButton>> = ({
  isDisabled,
  isLoading,
  loadingText,
  children,
  ...props
}) => {
  const buttonInner = (
    <Fragment>
      <Text data-text>{children}</Text>
      {isLoading && <Loading data-loading>{loadingText || 'LOADING...'}</Loading>}
    </Fragment>
  );

  return (
    <StyledButton isLoading={isLoading} disabled={isDisabled} {...props}>
      {buttonInner}
    </StyledButton>
  );
};

ButtonInternal.defaultProps = {
  isLoading: false,
  loadingText: null,
  appearance: 'primary',
  isDisabled: false,
  clickable: true,
  containsIcon: false,
  size: 'medium',
};

export const Button = React.memo(ButtonInternal);
