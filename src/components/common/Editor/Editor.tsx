import { FC, useState, useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames';
import throttle from 'lodash/throttle';

import { Label, FormGroup } from 'reactstrap';
import { Editor as DraftEditor, EditorState } from 'draft-js';
import { Editor as REditor, EditorProps } from 'react-draft-wysiwyg';

import editorConfig, { iconsArray } from 'components/common/Editor/editorConfig';

import { Maybe } from 'graphql/jsutils/Maybe';

interface Target {
  target: { value: Maybe<EditorState>; name: string };
}

interface Props extends Omit<EditorProps, 'onChange' | 'value'> {
  initialValue: EditorState;
  onChange?: (target: Target) => void;
  name: string;
  label: string;
  value: EditorState;
  placeholder?: string;
}

const changeCurrentXPosition = (wrapper: Element, modal: Element): string | void => {
  const differenceByContainer = window.innerWidth - wrapper.getBoundingClientRect().x;
  const differenceByModal = window.innerWidth - modal.getBoundingClientRect().x;

  (modal as HTMLDivElement).style.left = `-${289 - differenceByContainer}px`;

  if (differenceByModal > 320) (modal as HTMLDivElement).style.left = '5px';
};

const Editor: FC<Props> = ({ value, onChange, name, label, onBlur, ...props }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [editorRef, setEditorRef] = useState<Maybe<DraftEditor>>(null);
  const [imageModal, setImageModal] = useState<Maybe<Element>>(null);
  const [imageWrapper, setImageWrapper] = useState<Maybe<Element>>(null);
  const [linkModal, setLinkModal] = useState<Maybe<Element>>(null);
  const [linkWrapper, setLinkWrapper] = useState<Maybe<Element>>(null);

  const editorContainerRef = useRef(null);

  const handleTextEditorFocus = useCallback((): void => {
    setIsFocus(true);
  }, []);

  const handleTextEditorBlur = useCallback(
    (event): void => {
      event.target.id = name;

      if (onBlur) onBlur(event);

      setIsFocus(false);
    },
    [onBlur, name],
  );

  const handleChange = useCallback(
    (editorState: EditorState) => {
      if (onChange) onChange({ target: { value: editorState || null, name } });
    },
    [onChange, name],
  );

  const setEditorReference = useCallback((ref: DraftEditor): void => {
    if (ref) setEditorRef(ref);
  }, []);

  const handleLabelClick = useCallback((): void => {
    editorRef?.focus();
  }, [editorRef]);

  const handleChangeModalPosition = useCallback(() => {
    if (imageModal && imageWrapper) changeCurrentXPosition(imageWrapper, imageModal);

    if (linkModal && linkWrapper) changeCurrentXPosition(linkWrapper, linkModal);
  }, [imageModal, imageWrapper, linkModal, linkWrapper]);

  const handleSetImageModal = useCallback(() => {
    // setTimeout is needed to wait for the blocks to render and find them
    setTimeout(() => {
      setImageModal(document.querySelector('.rdw-image-modal'));
      setLinkModal(document.querySelector('.rdw-link-modal'));
    }, 0);
  }, []);

  useEffect(() => {
    const imageContainers = document.querySelectorAll('.rdw-option-wrapper');

    setImageWrapper(document.querySelector('.rdw-image-wrapper'));
    setLinkWrapper(document.querySelector('.rdw-link-wrapper'));

    window.addEventListener('resize', throttle(handleChangeModalPosition, 250));
    document.querySelector('.rdw-editor-toolbar')?.addEventListener('click', handleSetImageModal);

    // this action is used to replace <img> with <svg> to assign a hover effect to the buttons
    imageContainers.forEach((image, index) => {
      const { documentElement } = new DOMParser().parseFromString(
        iconsArray[index],
        'application/xml',
      );

      image.replaceChild(documentElement, image.childNodes[0]);
    });
  }, [handleChangeModalPosition, handleSetImageModal]);

  useEffect(() => {
    if (imageModal) handleChangeModalPosition();

    if (linkModal) handleChangeModalPosition();
  }, [handleChangeModalPosition, imageModal, linkModal]);

  return (
    <div className='editor-container' ref={editorContainerRef}>
      <FormGroup className='editor-form-group'>
        {label && (
          <Label htmlFor={name} onClick={handleLabelClick}>
            {label}
          </Label>
        )}
        <REditor
          editorState={value}
          editorClassName='editor'
          toolbarClassName='editor-toolbar'
          wrapperClassName={classNames('editor-wrapper', { 'editor-focus': isFocus })}
          onEditorStateChange={handleChange}
          toolbar={editorConfig}
          onFocus={handleTextEditorFocus}
          onBlur={handleTextEditorBlur}
          editorRef={setEditorReference}
          ariaLabel={name}
          {...props}
        />
      </FormGroup>
    </div>
  );
};

export default Editor;
