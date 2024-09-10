import {
  Menu,
} from '@mantine/core';
import { NextLink } from '@mantine/next';

import {
  Fragment,
  useMemo,
} from 'react';

import { MenuLink } from '../../types';

import useLinkMemo from '../../useLinkMemo'

function Content() {
  const links = useLinkMemo()

  const data = useMemo((): MenuLink[] => {
    return links
      .filter(({ visible }) => visible !== false)
  }, [links])

  const content = useMemo(() => {
    return data
      .map((link, index) => {
        return (
          <UserMenuItem link={link} index={index} />
        )
      })
    },
    [links]
  );

  return (
    <>{content}</>
  )
}

function UserMenuItem({ link, index }: { link: MenuLink, index: number }) {
  const { href, label, as, rel } = link

  if (!href) {
    return (
      <Fragment key={`separator-${index}`}>{label}</Fragment>
    )
  }

  return (
    <Menu.Item
      key={href}
      display="flex"
      component={NextLink}
      href={href}
      as={as}
      rel={rel}
    >
      {label}
    </Menu.Item>
  )
}

export default Content