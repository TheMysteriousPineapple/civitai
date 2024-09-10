import { PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  value: boolean
}

function Show({ value, children }: IProps ) {
  if (!value) return <></>

  return (
    <>{children}</>
  )
}

export default Show