import {
  Burger,
  Divider,
  Menu,
  ScrollArea,
} from '@mantine/core';

import {
  useCallback,
  useContext
} from 'react';

import { useStore } from 'zustand'

import { AccountSwitcher } from '~/components/AppLayout/AppHeader/AccountSwitcher';
import { constants } from '~/server/common/constants';

import Chip from './Chip'
import Logout from './Logout';
import Content from './Content'
import Accounts from './Accounts'
import Settings from './Settings'
import ColorScheme from './ColorScheme';

import CurrentUser from '../CurrentUser';
import BuzzMenuItem from '../BuzzMenuItem';
import { StoreContext } from '../ModalContext'

import Show from '../Show';

function UserMenu() {
  const store = useContext(StoreContext)
  const [userMenuOpened, setUserMenuOpened] = useStore(store, (state) => [state.userMenuOpened, state.setUserMenuOpened])
  const userSwitching = useStore(store, (state) => state.userSwitching)
  const closeAll = useStore(store, (state) => state.closeAll)

  const onOpen = useCallback(() => {
    setUserMenuOpened(true)
  }, [])

  return (
    <Menu
      width={260}
      opened={userMenuOpened}
      position="bottom-end"
      transition="pop-top-right"
      zIndex={constants.imageGeneration.drawerZIndex + 1}
      onClose={closeAll}
      withinPortal
    >
      <CurrentUser mode={'authenticated'}>
        <Menu.Target>
          <Chip />
        </Menu.Target>
      </CurrentUser>

      <CurrentUser mode={'none'}>
        <Menu.Target>
          <Burger
            opened={userMenuOpened}
            onClick={onOpen}
            size="sm"
          />
        </Menu.Target>
      </CurrentUser>

      <Menu.Dropdown>
        <ScrollArea.Autosize
          maxHeight="calc(90vh - var(--mantine-header-height))"
          styles={{ root: { margin: -4 }, viewport: { padding: 4 } }}
          offsetScrollbars
        >
          <Show value={userSwitching}>
            <AccountSwitcher />
          </Show>
          <Show value={!userSwitching}>
            <>
              <CurrentUser mode={'authenticated'}>
                <Accounts />
              </CurrentUser>
              <BuzzMenuItem withAbbreviation={false} />
              <Content />
              <Divider my={4} />
              <ColorScheme />
              <CurrentUser mode={'authenticated'}>
                <Settings />
                <Logout />
              </CurrentUser>
            </>
          </Show>
        </ScrollArea.Autosize>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserMenu