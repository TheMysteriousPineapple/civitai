import {
  Badge,
  createStyles,
  Divider,
  Group,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBarbell,
  IconBookmark,
  IconBookmarkEdit,
  IconCloudLock,
  IconClubs,
  IconCrown,
  IconHistory,
  IconInfoSquareRounded,
  IconLink,
  IconMoneybag,
  IconPlayerPlayFilled,
  IconProgressBolt,
  IconUser,
  IconUserCircle,
  IconUsers,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import {
  ReactNode,
  useMemo,
} from 'react';

import { useSystemCollections } from '~/components/Collections/collection.utils';
import { dialogStore } from '~/components/Dialog/dialogStore';
import { ThumbsUpIcon } from '~/components/ThumbsIcon/ThumbsIcon';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { LoginRedirectReason } from '~/utils/login-helpers';
import { containerQuery } from '~/utils/mantine-css-helpers';
import dynamic from 'next/dynamic';

import type { MenuLink } from './types';

const FeatureIntroductionModal = dynamic(() =>
  import('~/components/FeatureIntroduction/FeatureIntroduction').then(
    (m) => m.FeatureIntroductionModal
  )
);

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    flexWrap: 'nowrap',
    paddingLeft: theme.spacing.xs * 1.6, // 16px
    paddingRight: theme.spacing.xs * 1.6, // 16px

    [containerQuery.smallerThan('md')]: {
      paddingLeft: theme.spacing.xs * 0.8, // 8px
      paddingRight: theme.spacing.xs * 0.8, // 8px
    },
  },

  burger: {
    display: 'flex',
    justifyContent: 'flex-end',
    [containerQuery.largerThan('md')]: {
      display: 'none',
    },
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',
    height: `calc(100% - ${HEADER_HEIGHT}px)`,

    [containerQuery.largerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [containerQuery.smallerThan('md')]: {
      display: 'none',
    },
  },

  searchArea: {
    [containerQuery.smallerThan('md')]: {
      display: 'none',
    },
  },

  links: {
    display: 'flex',
    [containerQuery.smallerThan('md')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [containerQuery.smallerThan('md')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    borderRadius: theme.radius.xl,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },

    [containerQuery.smallerThan('md')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },

  mobileSearchWrapper: {
    height: '100%',
  },

  dNone: {
    display: 'none',
  },
}));

function useLinksMemo(): MenuLink[] {
  const currentUser = useCurrentUser();
  const { theme } = useStyles();
  const router = useRouter();
  const features = useFeatureFlags();
  const {
    groupedCollections: {
      Article: bookmarkedArticlesCollection,
      Model: bookmarkedModelsCollection,
    },
  } = useSystemCollections();

  const links = useMemo<MenuLink[]>(() => {
    return [
      {
        href: `/user/${currentUser?.username}`,
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconUser stroke={1.5} color={theme.colors.blue[theme.fn.primaryShade()]} />
            Your profile
          </Group>
        ),
      },
      {
        href: `/user/${currentUser?.username}/models?section=training`,
        visible: !!currentUser && features.imageTrainingResults,
        label: (
          <Group align="center" spacing="xs">
            <IconBarbell stroke={1.5} color={theme.colors.green[theme.fn.primaryShade()]} />
            Training
          </Group>
        ),
      },
      {
        href: `/collections`,
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconBookmark stroke={1.5} color={theme.colors.green[theme.fn.primaryShade()]} />
            My collections
          </Group>
        ),
      },
      {
        href: `/collections/${bookmarkedModelsCollection?.id}`,
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <ThumbsUpIcon stroke={1.5} color={theme.colors.green[theme.fn.primaryShade()]} />
            Liked models
          </Group>
        ),
      },
      {
        href: `/collections/${bookmarkedArticlesCollection?.id}`,
        visible: !!currentUser && !!bookmarkedArticlesCollection,
        label: (
          <Group align="center" spacing="xs">
            <IconBookmarkEdit stroke={1.5} color={theme.colors.pink[theme.fn.primaryShade()]} />
            Bookmarked articles
          </Group>
        ),
      },
      {
        href: '/bounties?engagement=favorite',
        as: '/bounties',
        visible: !!currentUser && features.bounties,
        label: (
          <Group align="center" spacing="xs">
            <IconMoneybag stroke={1.5} color={theme.colors.pink[theme.fn.primaryShade()]} />
            My bounties
          </Group>
        ),
      },
      {
        href: '/clubs?engagement=engaged',
        as: '/clubs',
        visible: !!currentUser && features.clubs,
        label: (
          <Group align="center" spacing="xs">
            <IconClubs stroke={1.5} color={theme.colors.pink[theme.fn.primaryShade()]} />
            My clubs
          </Group>
        ),
      },
      {
        href: '/user/buzz-dashboard',
        visible: !!currentUser && features.buzz,
        label: (
          <Group align="center" spacing="xs">
            <IconProgressBolt stroke={1.5} color={theme.colors.yellow[7]} />
            Buzz dashboard
          </Group>
        ),
      },
      {
        href: '/user/vault',
        visible: !!currentUser && features.vault,
        label: (
          <Group align="center" spacing="xs">
            <IconCloudLock stroke={1.5} color={theme.colors.yellow[7]} />
            My vault
          </Group>
        ),
      },
      {
        href: '',
        visible: !!currentUser,
        label: <Divider my={4} />,
      },
      {
        href: '/leaderboard/overall',
        label: (
          <Group align="center" spacing="xs">
            <IconCrown stroke={1.5} color={theme.colors.yellow[theme.fn.primaryShade()]} />
            Leaderboard
          </Group>
        ),
      },
      {
        href: '/product/link',
        label: (
          <Group align="center" spacing="xs">
            <IconLink stroke={1.5} />
            Download Link App
          </Group>
        ),
      },
      {
        href: `/user/${currentUser?.username}/following`,
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconUsers stroke={1.5} />
            Creators you follow
          </Group>
        ),
      },
      {
        href: '/user/downloads',
        visible: !!currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconHistory stroke={1.5} />
            Download history
          </Group>
        ),
      },
      {
        href: `/login?returnUrl=${router.asPath}`,
        visible: !currentUser,
        label: (
          <Group align="center" spacing="xs">
            <IconUserCircle stroke={1.5} />
            Sign In/Sign up
          </Group>
        ),
        rel: 'nofollow',
      },
      {
        href: '/questions',
        visible: !!currentUser && features.questions,
        label: (
          <Group align="center" spacing="xs">
            <IconInfoSquareRounded stroke={1.5} />
            Questions{' '}
            <Badge color="yellow" size="xs">
              Beta
            </Badge>
          </Group>
        ),
      },
      {
        href: '#!',
        visible: !!currentUser,
        label: (
          <UnstyledButton
            onClick={() => {
              dialogStore.trigger({
                component: FeatureIntroductionModal,
                props: {
                  feature: 'getting-started',
                  contentSlug: ['feature-introduction', 'welcome'],
                },
              });
            }}
          >
            <Group align="center" spacing="xs">
              <IconPlayerPlayFilled stroke={1.5} />
              Getting Started
            </Group>
          </UnstyledButton>
        ),
      },
    ]
    // .filter(({ visible }) => visible !== false)
  },
  [
    currentUser,
    currentUser?.username,
    features.imageTrainingResults,
    features.bounties,
    features.buzz,
    features.questions,
    features.clubs,
    features.vault,
    bookmarkedModelsCollection,
    bookmarkedArticlesCollection,
    router.asPath,
  ]);

  return links
}

export default useLinksMemo