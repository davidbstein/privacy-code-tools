/**
 * idempotent state update. replaces entries located at
 * state.<object_type>.<object_id>
 * @param {object} state - the current state, which starts as {@link defaultState} and gets filled in as API calls complete.
 * @param {object} object_copies - objects, keyed on id
 * @param {String} object_type
 * @returns the next state
 */
export function overwrite_stored_object_copies(state, object_copies, object_type) {
  return {
    ...state,
    ...{
      [object_type]: {
        ...state[object_type],
        ...object_copies,
      },
    },
  };
}
