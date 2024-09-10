import {
  Group,
  Menu,
} from '@mantine/core';

import {
  IconChevronRight,
} from '@tabler/icons-react';
import {
  useCallback,
  useContext
} from 'react';

import { useStore } from 'zustand'

import UserAvatar2 from '../../UserAvatar2';

import { StoreContext } from '../../ModalContext'

function Accounts() {
  const store = useContext(StoreContext)
  const setUserSwitching = useStore(store, (state) => state.setUserSwitching)

  const onClick = useCallback(() => {
    setUserSwitching(true)
  }, [])

  return (
    <Menu.Item
      onClick={onClick}
      closeMenuOnClick={false}
      mb={4}
    >
      <Group w="100%" position={'apart'}>
        <UserAvatar2 withUsername />
        <IconChevronRight />
      </Group>
    </Menu.Item>
  )
}

export default Accounts