import {
  Menu,
} from '@mantine/core';
import { NextLink } from '@mantine/next';

import {
  useMemo,
} from 'react';

import { MenuLink } from '../../types';

import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';

import useMainActionsMemo from '../../useMainActionsMemo';

function Content() {
  const actions = useMainActionsMemo()

  const data = useMemo((): MenuLink[] => {
    return actions
      .filter(({ visible }) => visible !== false)
  }, [actions])

  const content = useMemo(() => {
    return data
      .map((link, index) => {
        return (
          <CustomMenuItem link={link} index={index} />
        )
      })
    },
    [data]
  );

  return (
    <>{content}</>
  )
}

function CustomMenuItem({ link, index }: { link: MenuLink, index: number}) {
  const menuItem = (
    <Menu.Item
      key={!link.redirectReason ? index : undefined}
      component={NextLink}
      href={link.href}
      as={link.as}
      rel={link.rel}
    >
      {link.label}
    </Menu.Item>
  );

  return link.redirectReason ? (
    <LoginRedirect key={index} reason={link.redirectReason} returnUrl={link.href}>
      {menuItem}
    </LoginRedirect>
  ) : (
    menuItem
  );
}

export default Content