import type {
  ReactNode,
  RefObject,
  ReactElement
} from 'react';

import { LoginRedirectReason } from '~/utils/login-helpers';

type AppHeaderProps = {
  renderSearchComponent?: (opts: RenderSearchComponentProps) => ReactElement;
  fixed?: boolean;
};

type RenderSearchComponentProps = {
  onSearchDone?: () => void;
  isMobile: boolean;
  ref?: RefObject<HTMLInputElement>;
};

type MenuLink = {
  label: ReactNode;
  href: string;
  redirectReason?: LoginRedirectReason;
  visible?: boolean;
  as?: string;
  rel?: string;
};

export type {
  AppHeaderProps,
  RenderSearchComponentProps,
  MenuLink
}