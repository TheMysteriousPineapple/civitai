import { GenerateButton } from '~/components/RunStrategy/GenerateButton';

import useIsMuted from '../useIsMuted';

function MobileCreateButton() {
  const isMuted = useIsMuted()

  if (isMuted) return null

  return (
    <GenerateButton
      variant="light"
      py={8}
      px={12}
      h="auto"
      radius="sm"
      mode="toggle"
      compact
      className="inline-block md:hidden"
      data-activity="create:navbar"
    />
  );
}

export default MobileCreateButton
