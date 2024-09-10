import {
  Group,
  Text,
  useMantineTheme
} from '@mantine/core';

import { Currency } from '@prisma/client';
import {
  IconBarbell,
  IconBrush,
  IconClubs,
  IconMoneybag,
  IconPhotoUp,
  IconUpload,
  IconVideoPlus,
  IconWriting,
} from '@tabler/icons-react';

import {
  useMemo,
} from 'react';

import type { MenuLink } from './types';

import { CurrencyIcon } from '~/components/Currency/CurrencyIcon';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import useIsMuted from './useIsMuted';

export function useMainActionsMemo() {
  const theme = useMantineTheme()
  const features = useFeatureFlags();
  const isMuted = useIsMuted()

  const mainActions = useMemo<MenuLink[]>((): MenuLink[] => {
    const stuff: MenuLink[] = [
      {
        href: '/generate',
        visible: !isMuted,
        label: (
          <Group align="center" spacing="xs">
            <IconBrush stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Generate images
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/posts/create',
        visible: !isMuted,
        redirectReason: 'post-images',
        label: (
          <Group align="center" spacing="xs">
            <IconPhotoUp stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Post images
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/posts/create?video=true',
        visible: !isMuted,
        redirectReason: 'post-images',
        label: (
          <Group align="center" spacing="xs">
            <IconVideoPlus stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Post videos
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/models/create',
        visible: !isMuted,
        redirectReason: 'upload-model',
        label: (
          <Group align="center" spacing="xs">
            <IconUpload stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Upload a model
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/models/train',
        visible: !isMuted && features.imageTraining,
        redirectReason: 'train-model',
        label: (
          <Group align="center" spacing="xs">
            <IconBarbell stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            <Text span inline>
              Train a LoRA
            </Text>
            <CurrencyIcon currency={Currency.BUZZ} size={16} />
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/articles/create',
        visible: !isMuted,
        redirectReason: 'create-article',
        label: (
          <Group align="center" spacing="xs">
            <IconWriting stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Write an article
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/bounties/create',
        visible: !isMuted && features.bounties,
        redirectReason: 'create-bounty',
        label: (
          <Group align="center" spacing="xs">
            <IconMoneybag stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            <Text>Create a bounty</Text>
            <CurrencyIcon currency={Currency.BUZZ} size={16} />
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/clubs/create',
        visible: !isMuted && features.clubs,
        redirectReason: 'create-club',
        label: (
          <Group align="center" spacing="xs">
            <IconClubs stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            <Text>Create a club</Text>
          </Group>
        ),
        rel: 'nofollow',
      },
    ]

    return stuff
  },
  [features.bounties, features.imageTraining, features.clubs, isMuted, theme]);

  return mainActions
}

export default useMainActionsMemo