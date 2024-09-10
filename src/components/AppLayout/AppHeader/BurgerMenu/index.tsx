import {
  ActionIcon,
  Anchor,
  Box,
  Burger,
  Divider,
  Group,
  Paper,
  Portal,
  ScrollArea,
  Transition,
} from '@mantine/core';

import {
  IconChevronRight,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Fragment,
  useMemo,
  useContext,
  useCallback,
  PropsWithChildren
} from 'react';
import { AccountSwitcher } from '~/components/AppLayout/AppHeader/AccountSwitcher';
import { BrowsingModeMenu } from '~/components/BrowsingMode/BrowsingMode';
import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';

import CurrentUser from '../CurrentUser';

import Logout from './Logout'
import BuzzMenuItem from '../BuzzMenuItem';

import useStylesExt from '../useStylesExt';
import ColorScheme from './ColorScheme';
import Settings from './Settings'

import Show from '../Show'

import { MenuLink } from '../types'

import { StoreContext } from '../ModalContext';

import { useStore } from 'zustand'

import Content from './Content';

const useStyles = useStylesExt;

function BurgerMenu() {
  const { classes, cx } = useStyles();

  const store = useContext(StoreContext)
  const [burgerOpened, setBurgerOpened]  = useStore(store, (state) => [state.burgerOpened, state.setBurgerOpened])
  const [userSwitching, setUserSwitching] = useStore(store, (state) => [state.userSwitching, state.setUserSwitching])

  const onBurgerOpen = useCallback(() => {

  }, [])

  const onBurgerClose = useCallback(() => {
    setBurgerOpened(false)
  }, [])

  return (
    <>
      <Burger
        opened={burgerOpened}
        onClick={() => setBurgerOpened(!burgerOpened)}
        size="sm"
      />
      <Transition transition="scale-y" duration={200} mounted={burgerOpened}>
        {(styles) => (
          <Portal target="#main">
            <Paper
              className={classes.dropdown}
              withBorder
              shadow="md"
              style={{ ...styles, borderLeft: 0, borderRight: 0 }}
              radius={0}
              sx={{ zIndex: 1002 }}
            >
              <Show value={userSwitching}>
                {/* // TODO maybe move this to account switcher */}
                <ScrollArea.Autosize maxHeight={'calc(100dvh - 135px)'}>
                  <AccountSwitcher inMenu={false} />
                </ScrollArea.Autosize>
              </Show>
              <Show value={!userSwitching}>
                <>
                  {/* Calculate maxHeight based off total viewport height minus header + footer + static menu options inside dropdown sizes */}
                  <ScrollArea.Autosize maxHeight={'calc(100dvh - 135px)'}>
                    {/* <CurrentUser mode={'authenticated'}>
                      <Group
                        className={classes.link}
                        w="100%"
                        position="apart"
                        sx={{ cursor: 'pointer' }}
                        onClick={onUserSwitching}
                      >
                        <UserAvatar2 withUsername />
                        <IconChevronRight />
                      </Group>
                    </CurrentUser> */}
                    <BuzzMenuItem mx={0} mt={0} textSize="sm" withAbbreviation={false} />
                    <Content />
                    <CurrentUser mode={'authenticated'}>
                      <Divider />
                      <Box px="md" pt="md">
                        <BrowsingModeMenu closeMenu={onBurgerClose} />
                      </Box>
                    </CurrentUser>
                  </ScrollArea.Autosize>

                  <Group p="md" position="apart" grow>
                    <ColorScheme />
                    <CurrentUser mode={'authenticated'}>
                      <Settings />
                      <Logout />
                    </CurrentUser>
                  </Group>
                </>
              </Show>
            </Paper>
          </Portal>
        )}
      </Transition>
    </>
  );
}

export default BurgerMenu