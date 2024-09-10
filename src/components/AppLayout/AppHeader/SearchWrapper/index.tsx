import {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  ReactElement
} from 'react';

import { useStore } from 'zustand'

import { AutocompleteSearch } from '~/components/AutocompleteSearch/AutocompleteSearch';

import { StoreContext } from '../ModalContext';

import { useIsMobile } from '~/hooks/useIsMobile'

import classes from './style.module.css'

import type {
  RenderSearchComponentProps
} from '../types'

interface ISearchWrapperProps {
  renderSearchComponent?: (props: RenderSearchComponentProps) => ReactElement
}

// function defaultRenderSearchComponent({ onSearchDone, isMobile, ref }: RenderSearchComponentProps) {
//   if (isMobile) {
//     return (
//       <AutocompleteSearch
//         variant="filled"
//         onClear={onSearchDone}
//         onSubmit={onSearchDone}
//         rightSection={null}
//         ref={ref}
//       />
//     );
//   }

//   return <AutocompleteSearch />;
// }

function DefaultRenderSearchComponent({ onSearchDone, isMobile, ref }: RenderSearchComponentProps) {
  if (isMobile) {
    return (
      <AutocompleteSearch
        variant="filled"
        onClear={onSearchDone}
        onSubmit={onSearchDone}
        rightSection={null}
        ref={ref}
      />
    );
  }

  return <AutocompleteSearch />;
}


// function SearchWrapper({ renderSearchComponent = defaultRenderSearchComponent }: ISearchWrapperProps ) {
function SearchWrapper() {
  const searchRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile()
  const store = useContext(StoreContext)
  const [showSearch, setShowSearch] = useStore(store, (state) => [state.showSearch, state.setShowSearch])

  const className = useMemo((): string => {
    return showSearch
      ? [classes.search, classes.show].join(' ')
      : classes.search
  }, [showSearch])
  
  const onSearchDone = useCallback(() => {
    setShowSearch(false);
  }, [])

  useEffect(() => {
    if (showSearch) {
      searchRef?.current?.focus(); // Automatically focus input on mount
    }
  }, [showSearch]);

  return (
    <div className={className}>
      <div>hello desktop</div>
      <DefaultRenderSearchComponent onSearchDone={onSearchDone} isMobile={isMobile} ref={searchRef} />
      {/* {renderSearchComponent({ onSearchDone, isMobile, ref: searchRef })} */}
    </div>
  )
}

export default SearchWrapper