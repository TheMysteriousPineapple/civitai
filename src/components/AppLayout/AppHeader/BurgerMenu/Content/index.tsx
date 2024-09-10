import {
  Anchor,
  Divider,
} from '@mantine/core';

import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Fragment,
  useMemo,
  useContext,
  useCallback,
} from 'react';

import { LoginRedirect } from '~/components/LoginRedirect/LoginRedirect';

import useStylesExt from '../../useStylesExt';

import { MenuLink } from '../../types'

import { StoreContext } from '../../ModalContext';

import { useStore } from 'zustand'

const useStyles = useStylesExt;

import useLinksMemo from '../../useLinkMemo';
import useMainActionsMemo from '../../useMainActionsMemo';

function Content() {
  const links = useLinksMemo()
  const mainActions = useMainActionsMemo()

  const data = useMemo((): MenuLink[] => {
    return mainActions
      .concat([{ href: '', label: <Divider /> }, ...links])
      .filter(({ visible }) => visible !== false)
  }, [links, mainActions])

  const content = useMemo(() =>
      data
        .map((link, index) => {
          return (
            <BurgerMenuItem link={link} index={index} />
          )
        }),
    [data]
  );

  return (
    <>{content}</>
  );
}

function BurgerMenuItem({ link, index }: { link: MenuLink, index: number }) {
  const { href, label, redirectReason } = link
  const item = useMemo(() => {
    if (!href) {
      return (
        <Fragment key={`separator-${index}`}>{label}</Fragment>
      )
    }

    return (
      <BurgerMenuItemLink link={link} />
    )
  }, [link])

  if (!redirectReason) {
    return item
  }

  return (
    <LoginRedirect key={href} reason={redirectReason} returnUrl={href}>
      {item}
    </LoginRedirect>
  )
}

function BurgerMenuItemLink({ link }: { link: MenuLink }) {
  const { href, as, rel, label } = link
  const router = useRouter();
  const { classes, cx } = useStyles();

  const store = useContext(StoreContext)
  const setBurgerOpened = useStore(store, (state) => state.setBurgerOpened)

  const onClick = useCallback(() => {
    setBurgerOpened(false)
  }, [])

  return (
    <Link href={href} as={as} passHref>
      <Anchor
        variant="text"
        className={cx(classes.link, { [classes.linkActive]: router.asPath === href })}
        onClick={onClick}
        rel={rel}
      >
        {label}
      </Anchor>
    </Link>
  )
}

export default Content