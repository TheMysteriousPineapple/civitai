import React, { createContext } from 'react';
import type { PropsWithChildren } from 'react';

import { createStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

type AppHeaderModalState = {
  burgerOpened: boolean, 
  userMenuOpened: boolean, 
  userSwitching: boolean,
  showSearch: boolean,
  setBurgerOpened: (value: boolean) => void;
  setUserMenuOpened: (value: boolean) => void;
  setUserSwitching: (value: boolean) => void;
  setShowSearch: (value: boolean) => void;
  closeAll:() => void
};

const store = createStore<AppHeaderModalState>()(
  devtools(
    immer((set) => {
      return {
        burgerOpened: false, 
        userMenuOpened: false, 
        userSwitching: false,
        showSearch: false,

        setBurgerOpened: (value: boolean) => {
          set((state) => {
            state.burgerOpened = value
          });
        },

        setUserMenuOpened: (value: boolean) => {
          set((state) => {
            state.userMenuOpened = value
          });
        },

        setUserSwitching: (value: boolean) => {
          set((state) => {
            state.userSwitching = value
          });
        },

        setShowSearch: (value: boolean) => {
          set((state) => {
            state.showSearch = value
          });
        },

        closeAll: () => {
          set((state) => {
            state.burgerOpened = false
            state.userMenuOpened = false
            state.userSwitching = false
          });
        }
      };
    })
  )
);

const StoreContext = createContext<StoreApi<AppHeaderModalState>>(store)

function Provider({ children }: PropsWithChildren) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
} 

export {
  StoreContext,
  Provider
}
