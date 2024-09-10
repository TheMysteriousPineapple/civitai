import { useCallback, useContext } from 'react';
import type { MouseEvent } from 'react';

import Link from 'next/link';

import { useStore } from 'zustand'

import {
  Button,
  Group,
  GroupProps,
} from '@mantine/core';

import type {
  MantineSize,
  MantineTheme
} from '@mantine/core'

import { useCurrentUser } from '~/hooks/useCurrentUser';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { openBuyBuzzModal } from '~/components/Modals/BuyBuzzModal';
import { UserBuzz } from '~/components/User/UserBuzz';

import { StoreContext } from '../ModalContext'

interface IProps extends GroupProps {
  textSize?: MantineSize;
  withAbbreviation?: boolean;
}

function BuzzMenuItem(props: IProps) {
  const {
    textSize = 'md',
    withAbbreviation = true,
    ...groupProps
  } = props
  
  const isMobile = useIsMobile();
  const features = useFeatureFlags();
  const currentUser = useCurrentUser();

  const store = useContext(StoreContext)
  const closeAll = useStore(store, (state) => state.closeAll)

  const sx = useCallback((theme: MantineTheme) => {
    return {
      cursor: 'pointer',
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
    }
  }, [])

  const buyBuzz = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    openBuyBuzzModal({}, { fullScreen: isMobile });
  }, [])

  if (!features.buzz) return null;
  if (!currentUser) return null;

  return (
    <Link href="/user/buzz-dashboard">
      <Group
        p="sm"
        position="apart"
        mx={-4}
        mb={4}
        sx={sx}
        onClick={closeAll}
        noWrap
        {...groupProps}
      >
        <Group spacing={4} noWrap>
          <UserBuzz
            iconSize={16}
            textSize={textSize}
            withAbbreviation={withAbbreviation}
            withTooltip={withAbbreviation}
          />
        </Group>
        <Button
          variant="white"
          radius="xl"
          size="xs"
          px={12}
          onClick={buyBuzz}
          compact
        >
          {'Buy Buzz'}
        </Button>
      </Group>
    </Link>
  );
}

export default BuzzMenuItem