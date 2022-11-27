import { useCallback } from 'react';

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

import { Maybe } from 'generated/graphql';

interface UseEditorStateResult {
  convertEditorStateToString: (state: EditorState) => string;
  formatEditorStateToJs: (state: EditorState) => Record<string, any>;
  getCurrentEditorState: (state?: Maybe<string>) => EditorState;
}

const useEditorState = (): UseEditorStateResult => {
  const convertEditorStateToString = useCallback((state): string => {
    try {
      return JSON.stringify(convertToRaw(state.getCurrentContent()));
    } catch (err) {
      return '';
    }
  }, []);

  const formatEditorStateToJs = useCallback((state): Record<string, any> => {
    return state.getCurrentContent().toJS().blockMap;
  }, []);

  const getCurrentEditorState = useCallback((state): EditorState => {
    if (state?.length) {
      try {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(state)));
      } catch (err) {
        return EditorState.createEmpty();
      }
    }

    return EditorState.createEmpty();
  }, []);

  return {
    convertEditorStateToString,
    formatEditorStateToJs,
    getCurrentEditorState,
  };
};

export default useEditorState;
