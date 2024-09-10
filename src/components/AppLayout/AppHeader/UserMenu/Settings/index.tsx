import {
  Menu,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconSettings,
} from '@tabler/icons-react';

const icon = <IconSettings stroke={1.5} />

function Settings() {
  return (
    <Menu.Item
      icon={icon}
      component={NextLink}
      href={'/user/account'}
    >
      {'Account settings'}
    </Menu.Item>
  )
}

export default Settings