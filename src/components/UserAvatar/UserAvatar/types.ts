import {
  AvatarProps,
  BadgeProps,
  IndicatorProps,
  MantineNumberSize,
  MantineSize,
} from '@mantine/core';

import { UserWithCosmetics } from '~/server/selectors/user.selector';

type UserAvatarProps = {
  user?: Partial<UserWithCosmetics> | null;
  withUsername?: boolean;
  withLink?: boolean;
  avatarProps?: AvatarProps;
  subText?: React.ReactNode;
  subTextForce?: boolean;
  size?: MantineSize;
  spacing?: MantineNumberSize;
  badge?: React.ReactElement<BadgeProps> | null;
  linkToProfile?: boolean;
  textSize?: MantineSize;
  subTextSize?: MantineSize;
  includeAvatar?: boolean;
  radius?: MantineNumberSize;
  avatarSize?: MantineSize | number;
  userId?: number;
  indicatorProps?: Omit<IndicatorProps, 'children'>;
  badgeSize?: number;
  withDecorations?: boolean;
  withOverlay?: boolean;
};

export type {
  UserAvatarProps
}