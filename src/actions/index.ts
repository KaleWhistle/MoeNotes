/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 24 Oct 2017
 * Description:
 */
import {combineEpics} from 'redux-observable';

export {default as definitions} from './definitions';
import * as theme from './theme';

export default combineEpics(
  theme.initEpic,
  theme.refreshEpic
);