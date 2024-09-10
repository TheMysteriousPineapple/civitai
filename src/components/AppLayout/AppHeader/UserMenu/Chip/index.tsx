import {
  Group,
  UnstyledButton,
} from '@mantine/core';

import {
  useMemo,
  useCallback,
  useContext
} from 'react';

import { useStore } from 'zustand'

import UserAvatar2 from '../../UserAvatar2';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';
import { UserBuzz } from '~/components/User/UserBuzz';

import { StoreContext } from '../../ModalContext'

import useStyles from './useStyles'

function Chip() {
  const features = useFeatureFlags();

  const store = useContext(StoreContext)
  const [userMenuOpened, setUserMenuOpened] = useStore(store, (state) => [state.userMenuOpened, state.setUserMenuOpened])

  const { classes, cx } = useStyles();

  const buzz = useMemo(() => {
    return features.buzz
      ? <UserBuzz pr="sm" />
      : null
      
  }, [features.buzz])

  const className = useMemo(() => {
    return userMenuOpened
      ? [classes.user, classes.userActive].join()
      : classes.user
  }, [userMenuOpened])

  const onOpen = useCallback(() => {
    setUserMenuOpened(true)
  }, [])

  return (
    <UnstyledButton
      className={className}
      onClick={onOpen}
    >
      <Group spacing={8} noWrap>
        <UserAvatar2 size="md" />
        {buzz}
      </Group>
    </UnstyledButton>
  )
}

export default Chip