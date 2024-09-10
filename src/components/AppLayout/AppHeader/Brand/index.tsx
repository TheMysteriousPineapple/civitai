import { useCallback, useContext } from 'react';
import { useStore } from 'zustand'

import { Anchor } from '@mantine/core';
import { NextLink } from '@mantine/next';

import { Logo } from '~/components/Logo/Logo';

import { StoreContext } from '../ModalContext'

export function Brand() {
  const store = useContext(StoreContext)
  const setBurgerOpened = useStore(store, (state) => state.setBurgerOpened)

  const onClick = useCallback(() => {
    setBurgerOpened(false)
  }, [])

  return (
    <Anchor
      component={NextLink}
      href="/"
      variant="text"
      onClick={onClick}
    >
      <Logo />
    </Anchor>
  );
}

export default Brand
