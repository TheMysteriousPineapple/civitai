import {
  Divider,
  Grid,
  Group,
  Header,
} from '@mantine/core';

import {
  ReactNode,
} from 'react';
import { BrowsingModeIcon } from '~/components/BrowsingMode/BrowsingMode';
import { ChatButton } from '~/components/Chat/ChatButton';
import { CivitaiLinkPopover } from '~/components/CivitaiLink/CivitaiLinkPopover';
import { ImpersonateButton } from '~/components/Moderation/ImpersonateButton';
import { NotificationBell } from '~/components/Notifications/NotificationBell';
import { UploadTracker } from '~/components/Resource/UploadTracker';
import { SupportButton } from '~/components/SupportButton/SupportButton';
import { useFeatureFlags } from '~/providers/FeatureFlagsProvider';

import Brand from './Brand'
import SignIn from './SignIn'
import UserMenu from './UserMenu';
import BurgerMenu from './BurgerMenu'
import CurrentUser from './CurrentUser'
import CreateMenu from './CreateMenu'
import SearchWrapper from './SearchWrapper';
import SearchAction from './SearchAction';
import MobileCreateButton from './MobileCreateButton'

import { Provider as ModalProvider } from './ModalContext';

import Show from './Show'

import type {
  AppHeaderProps,
} from './types'

import classes from './style.module.css'

const HEADER_HEIGHT = 70;

function AppHeader(props: AppHeaderProps) {
  const {
    renderSearchComponent,
  } = props
  
  return (
    <ModalProvider>
      <Header height={HEADER_HEIGHT} fixed={false} zIndex={200}>
        <Grid
          className={classes.header}
          m={0}
          gutter="xs"
          align="center"
        >
          <Grid.Col span="auto" pl={0}>
            <Group spacing="xs" noWrap>
              <Brand />
              <SupportButton />
              {/* Disabled until next event */}
              {/* <EventButton /> */}
            </Group>
          </Grid.Col>
          <SearchWrapper 
            // renderSearchComponent={renderSearchComponent}
          />
          <Grid.Col span="auto" className={classes.links}>
            <Group spacing="md" align="center" noWrap>
              <Group spacing="sm" noWrap>
                <TitleBarBasics>
                  <CurrentUser mode={'authenticated'}>
                    <UploadTracker />
                  </CurrentUser>
                  <CurrentUser mode={'authenticated'}>
                    <CivitaiLinkPopover />
                  </CurrentUser>
                  <CurrentUser mode={'authenticated'}>
                    <BrowsingModeIcon />
                  </CurrentUser>
                </TitleBarBasics>
              </Group>
              <CurrentUser mode={'none'}>
                <SignIn />
              </CurrentUser>
              <CurrentUser mode={'authenticated'}>
                <Divider orientation="vertical" />
              </CurrentUser>
              <UserMenu />
            </Group>
          </Grid.Col>
          <Grid.Col span="auto" className={classes.burger}>
            <Group spacing={4} noWrap>
              <TitleBarBasics>
                <SearchAction />
                <CurrentUser mode={'authenticated'}>
                  <CivitaiLinkPopover />
                </CurrentUser>
              </TitleBarBasics>
              <BurgerMenu />
            </Group>
          </Grid.Col>
        </Grid>
      </Header>
    </ModalProvider>
  );
}

function TitleBarBasics({ children }: { children: ReactNode | ReactNode[] }) {
  const features = useFeatureFlags();

  return (
    <>
      <CreateMenu />
      {children}
      <BrowsingModeIcon />
      <CurrentUser mode={'authenticated'}>
        <NotificationBell />
        <Show value={features.chat}>
          <ChatButton />
        </Show>
        {/* <Show value={currentUser?.isModerator}>
          <ModerationNav />
        </Show> */}
        <ImpersonateButton />
      </CurrentUser>
    </>
  )
}

export {
  AppHeader
}