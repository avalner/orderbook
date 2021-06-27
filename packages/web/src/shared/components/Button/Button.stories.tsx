import styled from '@emotion/styled';
import { Button } from './Button';
import { Icon } from '../Icon/Icon';

export default {
  title: 'Design System/Button',
  component: Button,
};

export const AllButtons = () => (
  <ButtonsWrapper>
    <Button appearance="primary">PRIMARY</Button>
    <Button appearance="secondary">SECONDARY</Button>
    <Button appearance="primaryOutline">OUTLINE PRIMARY</Button>
    <Button appearance="secondaryOutline">OUTLINE SECONDARY</Button>
    <Button appearance="primary" isDisabled>
      DISABLED
    </Button>
    <br />
    <Button appearance="primary" isLoading>
      PRIMARY
    </Button>
    <Button appearance="secondary" isLoading>
      SECONDARY
    </Button>
    <Button appearance="primaryOutline" isLoading>
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline" isLoading>
      OUTLINE SECONDARY
    </Button>
    <br />
    <Button appearance="primary" size="small">
      PRIMARY
    </Button>
    <Button appearance="secondary" size="small">
      SECONDARY
    </Button>
    <Button appearance="primaryOutline" size="small">
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline" size="small">
      OUTLINE SECONDARY
    </Button>
    <Button appearance="primary" isDisabled size="small">
      DISABLED
    </Button>
  </ButtonsWrapper>
);

AllButtons.storyName = 'All Buttons';

export const CustomColors = () => (
  <ButtonsWrapper>
    <Button appearance="primary" color="purple">
      PRIMARY
    </Button>
    <Button appearance="secondary" color="red">
      SECONDARY
    </Button>
    <Button appearance="primaryOutline" color="purple">
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline" color="red">
      OUTLINE SECONDARY
    </Button>
    <Button appearance="primary" color="orange" isDisabled>
      DISABLED
    </Button>
    <br />
    <Button appearance="primary" size="small" color="purple">
      PRIMARY
    </Button>
    <Button appearance="secondary" size="small" color="red">
      SECONDARY
    </Button>
    <Button appearance="primaryOutline" size="small" color="purple">
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline" size="small" color="red">
      OUTLINE SECONDARY
    </Button>
    <Button appearance="primary" isDisabled size="small" color="orange">
      DISABLED
    </Button>
  </ButtonsWrapper>
);

CustomColors.storyName = 'Custom Colors';

export const ButtonsWithIcons = () => (
  <ButtonsWrapper>
    <Button appearance="primary">
      <Icon icon="warning" />
      PRIMARY
    </Button>
    <Button appearance="secondary">
      <Icon icon="share" />
      SECONDARY
    </Button>
    <Button appearance="primaryOutline">
      <Icon icon="button" />
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline">
      <Icon icon="add" />
      OUTLINE SECONDARY
    </Button>
    <Button appearance="primary" isDisabled>
      <Icon icon="key" />
      DISABLED
    </Button>
    <br />
    <Button appearance="primary" size="small">
      <Icon icon="admin" />
      PRIMARY
    </Button>
    <Button appearance="secondary" size="small">
      <Icon icon="alert" />
      SECONDARY
    </Button>
    <Button appearance="primaryOutline" size="small">
      <Icon icon="arrowdown" />
      OUTLINE PRIMARY
    </Button>
    <Button appearance="secondaryOutline" size="small">
      <Icon icon="back" />
      OUTLINE SECONDARY
    </Button>
    <Button appearance="primary" isDisabled size="small">
      <Icon icon="box" />
      DISABLED
    </Button>
  </ButtonsWrapper>
);

ButtonsWithIcons.storyName = 'All Buttons with Icons';

const ButtonsWrapper = styled.div`
  & > * {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;
