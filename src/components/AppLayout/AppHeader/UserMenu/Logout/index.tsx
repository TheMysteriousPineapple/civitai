import { useCallback } from 'react'

import {
  Menu,
  useMantineTheme
} from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useAccountContext } from '~/components/CivitaiWrapped/AccountProvider';

function Logout() {
  const theme = useMantineTheme()
  const { logout } = useAccountContext();

  const onClick = useCallback(() => {
    logout()
  }, [logout])

  return (
    <Menu.Item
      icon={<IconLogout color={theme.colors.red[9]} stroke={1.5} />}
      onClick={onClick}
    >
      {'Logout'}
    </Menu.Item>
  )
}

export default Logout
