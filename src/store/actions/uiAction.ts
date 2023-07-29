/* Action types */

export const SHOW_AUTH_WALL = "SHOW_AUTH_WALL";
export const HIDE_AUTH_WALL = "HIDE_AUTH_WALL";

/* Actions */

export const showAuthWall = () => ({
  type: SHOW_AUTH_WALL,
});

export const hideAuthWall = () => ({
  type: HIDE_AUTH_WALL,
});
