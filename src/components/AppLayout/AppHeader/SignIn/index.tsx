import { Button } from '@mantine/core';
import { NextLink } from '@mantine/next';

import { useRouter } from 'next/router';

export function SignIn() {
  const router = useRouter();

  return (
    <Button
      component={NextLink}
      href={`/login?returnUrl=${router.asPath}`}
      rel="nofollow"
      variant="default"
    >
      {'Sign In'}
    </Button>
  );
}

export default SignIn
