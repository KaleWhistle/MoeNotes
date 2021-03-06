/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 24 Oct 2017
 * Description:
 */
import {Record, fromJS} from 'immutable';
import {TList, TItem} from '../types';
import {definitions} from '../actions';
import config from '../config';

export const defaultState: TList = fromJS({
  name: '',
  path: '',
  current: '',
  children: [],
  lut: {},
  open: false
});

export default (name: 'shelf' | 'book' | 'chapter') => (
  state = defaultState,
  action: {
    type: string,
    self?: TItem,
    children?: TItem[],
    child?: TItem,
    child2?: TItem,
    name?: string
  }
): TList => {
  switch (action.type) {
    case definitions[name].load: {
      let lut = state.get('lut', null).clear();
      const children = fromJS(action.children);
      action.children.forEach(({name: key, path: p}, index) => {
        lut = lut.set(key, fromJS({path: p, index}));
      });
      const result = fromJS({
        children,
        lut,
        current: action.name
      });

      if (name === 'shelf') {
        return result.merge({
          name: '', path: config.paths.tree
        });
      }

      return result.merge({
        name: action.self.name,
        path: action.self.path
      });
    }

    case definitions[name].add: {
      return state.mergeDeep({children: action.child})
        .setIn(['lut', action.child.name], fromJS({
          path: action.child.path, index: state.get('children', []).size
        }));
    }

    case definitions[name].delete: {
      const index = state.getIn(['lut', action.name, 'index']);
      return state.deleteIn(['children', index])
        .deleteIn(['lut', action.name]);
    }

    case definitions[name].renameSelf: {
      return state.set('name', action.name);
    }

    case definitions[name].renameChild: {
      const index = state.getIn(['lut', action.child.name, 'index']);
      return state.setIn(['children', index], fromJS(action.child2))
        .deleteIn(['lut', action.child.name])
        .setIn(['lut', action.child2.name], fromJS({
          path: action.child2.path, index
        }));
    }

    case definitions[name].select: {
      return state.set('current', action.name);
    }

    case definitions[name].swap: {
      const index1 = state.getIn(['lut', action.child.name, 'index']);
      const index2 = state.getIn(['lut', action.child2.name, 'index']);
      const item1 = state.getIn(['children', index1]);
      const item2 = state.getIn(['children', index2]);

      return state.setIn(['children', index1], item2)
        .setIn(['children', index2], item1)
        .setIn(['lut', action.child.name, 'index'], index2)
        .setIn(['lut', action.child2.name, 'index'], index1);
    }

    case definitions[name].open: {
      return state.set('open', true);
    }

    case definitions[name].close: {
      return state.set('open', false);
    }

    default:
      return state;
  }
};
