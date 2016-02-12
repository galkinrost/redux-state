import {PropTypes} from 'react';

export const storePropType = PropTypes.object;
export const stateIdPropType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
]);