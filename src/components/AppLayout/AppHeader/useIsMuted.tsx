import { useMemo } from 'react';

import { useCurrentUser } from '~/hooks/useCurrentUser';

export function useIsMuted() {
  const currentUser = useCurrentUser();

  const isMuted = useMemo(() => {
    return currentUser?.muted ?? false;
  }, [currentUser?.muted])

  return isMuted
}

export default useIsMuted
