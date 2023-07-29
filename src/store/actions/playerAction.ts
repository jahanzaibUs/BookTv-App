/* Action types */
export const UPDATE_PLAYER = "UPDATE_PLAYER";

/* Actions */

export const updatePlayer = (data?: any) => ({
  type: UPDATE_PLAYER,
  payload: data,
});
