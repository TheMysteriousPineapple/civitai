import {
  useMemo,
  useCallback,
} from 'react';

import {
  ActionIcon,
  MantineTheme,
  useMantineColorScheme,
} from '@mantine/core';  

import {
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react';  

function ColorScheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const icon = useMemo(() => {
    return colorScheme === 'dark' 
      ? <IconSun size={18} />
      : <IconMoonStars size={18} />
  }, [])

  const sx = useCallback((theme: MantineTheme) => {
    return {
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.yellow[theme.fn.primaryShade()]
          : theme.colors.blue[theme.fn.primaryShade()],
    }
  }, [])

  const onClick = useCallback(() => {
    toggleColorScheme()
  }, [toggleColorScheme])

  return (
    <ActionIcon
      variant="default"
      onClick={onClick}
      size="lg"
      sx={sx}
    >
      {icon}
    </ActionIcon>
  );
}

export default ColorScheme