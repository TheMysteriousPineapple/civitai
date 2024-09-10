import {
  Button,
  Group,
  Menu,
} from '@mantine/core';

import {
  IconChevronDown,
} from '@tabler/icons-react';

import { constants } from '~/server/common/constants';
import { GenerateButton } from '~/components/RunStrategy/GenerateButton';

import useIsMuted from '../useIsMuted';

import Content from './Content'

// Quick hack to avoid svg from going over the button. cc: Justin 👀
const sxRight = { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
const sxLeft = { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }

const zIndex = constants.imageGeneration.drawerZIndex + 2

import classes from './style.module.css'
 
export function CreateMenu() {
  const isMuted = useIsMuted()

  if (!!isMuted) return null 

  return  (
    <>
      <GenerateButton
        variant="light"
        py={8}
        px={12}
        h="auto"
        radius="sm"
        mode="toggle"
        compact
        // className="inline-block md:hidden"
        className={classes.mobile}
        data-activity="create:navbar"
      />
      <Menu
        position="bottom"
        offset={5}
        withArrow
        trigger="hover"
        openDelay={400}
        zIndex={zIndex}
        withinPortal
      >
        <Menu.Target>
          <Group spacing={0} noWrap className={classes.larger}>
            <GenerateButton
              variant="light"
              py={8}
              pl={12}
              pr={4}
              h="auto"
              radius="sm"
              mode="toggle"
              sx={sxRight}
              compact
              data-activity="create:navbar"
            />
            <Button
              variant="light"
              py={8}
              px={4}
              h="auto"
              radius="sm"
              sx={sxLeft}
            >
              <IconChevronDown stroke={2} size={20} />
            </Button>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Content />
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

export default CreateMenu
