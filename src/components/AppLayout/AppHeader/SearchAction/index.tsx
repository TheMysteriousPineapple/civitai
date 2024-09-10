import {
  useCallback,
  useContext,
} from 'react';

import {
  ActionIcon,
} from '@mantine/core';

import {
  IconSearch,
} from '@tabler/icons-react';

import { useStore } from 'zustand'

import { StoreContext } from '../ModalContext';

export function SearchAction() {  
  const store = useContext(StoreContext)
  const setShowSearch = useStore(store, (state) => state.setShowSearch)

  const onClick = useCallback(() => {
    setShowSearch(true)
  }, [])

  return (
    <ActionIcon onClick={onClick}>
      <IconSearch />
    </ActionIcon>
  );
}

export default SearchAction
