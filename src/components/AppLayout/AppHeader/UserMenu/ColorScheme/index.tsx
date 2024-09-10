import {
  useMemo,
  useCallback,
} from 'react';

import type { MouseEvent } from 'react'

import {
  Group,
  Menu,
  Switch,
  useMantineColorScheme,
} from '@mantine/core';

import {
  IconPalette,
} from '@tabler/icons-react';

const sx = { display: 'flex', alignItems: 'center' }
const icon = <IconPalette stroke={1.5} />

function ColorScheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const checked = useMemo(() => {
    return colorScheme === 'dark'
  }, [colorScheme])

  const onClick = useCallback(() => {
    toggleColorScheme()
  }, [toggleColorScheme])

  const onSwitchClick = useCallback((e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <Menu.Item
      closeMenuOnClick={false}
      icon={icon}
      onClick={onClick}
      >
      <Group align={'center'} position={'apart'}>
        {'Dark mode'}
        <Switch
          sx={sx}
          checked={checked}
          onClick={onSwitchClick}
        />
      </Group>
    </Menu.Item>
  );
}

export default ColorScheme
