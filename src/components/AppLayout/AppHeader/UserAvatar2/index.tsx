import { useCurrentUser } from '~/hooks/useCurrentUser';
import { trpc } from '~/utils/trpc';

import { UserAvatar } from '~/components/UserAvatar/UserAvatar';
import { UserAvatarProps } from '~/components/UserAvatar/UserAvatar/types';

function UserAvatar2(props: UserAvatarProps) {
  const currentUser = useCurrentUser();

  const { data: creator } = trpc.user.getCreator.useQuery(
    { id: currentUser?.id as number },
    { enabled: !!currentUser }
  );

  return (
    <UserAvatar 
      {...props} 
      user={creator ?? currentUser} 
    />
  )
}

export default UserAvatar2