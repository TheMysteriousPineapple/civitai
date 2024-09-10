import { useCallback } from 'react'

import {
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

import { useAccountContext } from '~/components/CivitaiWrapped/AccountProvider';

function Logout() {
  const { logout } = useAccountContext();
  const theme = useMantineTheme()

  const onClick = useCallback(() => {
    logout()
  }, [logout])

  return (
    <ActionIcon variant="default" onClick={onClick} size="lg">
      <IconLogout
        stroke={1.5}
        color={theme.colors.red[theme.fn.primaryShade()]}
      />
    </ActionIcon>
  )
}

export default Logout
