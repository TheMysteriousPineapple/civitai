import {
  ActionIcon,
} from '@mantine/core';

import {
  IconSettings,
} from '@tabler/icons-react';
import Link from 'next/link';

import {
  useCallback,
  useContext,
} from 'react';

import { StoreContext } from '../../ModalContext';

import { useStore } from 'zustand'

export function Settings() {
  const store = useContext(StoreContext)
  const setBurgerOpened  = useStore(store, (state) => state.setBurgerOpened)

  const onClick = useCallback(() => {
    setBurgerOpened(false)
  }, [])

  return (
    <Link href="/user/account">
      <ActionIcon
        variant="default"
        size="lg"
        onClick={onClick}
      >
        <IconSettings stroke={1.5} />
      </ActionIcon>
    </Link>
  );
}

export default Settings