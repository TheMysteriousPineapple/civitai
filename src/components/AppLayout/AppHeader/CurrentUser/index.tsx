import { useMemo } from 'react'

import type {
  PropsWithChildren,
} from 'react';

import { useCurrentUser } from '~/hooks/useCurrentUser';

interface IProps extends PropsWithChildren {
  mode: 'authenticated' | 'none'
}

function CurrentUser({ mode = 'authenticated', children }: IProps) {
  const currentUser = useCurrentUser();

  const show = useMemo(() => {
    switch(mode) {
      case 'authenticated':
        return !!currentUser
      case 'none':
        return !currentUser
      default:
        throw 'current user mode not defined'
    }
  }, [mode, currentUser])

  if (!show) return <></>

  return (
    <>{children}</>
  )
}

export default CurrentUser