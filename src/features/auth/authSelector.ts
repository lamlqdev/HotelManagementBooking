import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export const selectAuth = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth
);

export const selectUser = createSelector(selectAuth, (auth) => auth.user);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated
);
