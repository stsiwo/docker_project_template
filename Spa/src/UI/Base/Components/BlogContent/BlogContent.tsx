import * as React from 'react';
import './BlogContent.scss';
import { BlogContentPropType } from './types';
import { Link } from 'react-router-dom';
// Import the Slate editor factory.
import { createEditor, Mark, NodeEntry, Text, Element } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'src/slate-react'
import { Editor } from 'slate'
import { CustomElementProps, CustomElement } from 'src/slate-react/components/custom';
import { AiOutlinePicLeft, AiOutlinePicRight, AiOutlinePicCenter, AiOutlineFullscreen } from 'react-icons/ai';
import { FaBold, FaCode, FaItalic, FaImage } from 'react-icons/fa';
import { generateBlogContentPublicImageUrl } from 'src/utils';

declare type ImageCustomElementProps = CustomElementProps & {
  src: string
  publicSrc: URL
  imageFile?: Blob // extract this when saving. need to remove.
}

const BlogContent: React.FunctionComponent<BlogContentPropType> = (props: BlogContentPropType) => {

  const defaultElement: Element = {
    type: 'paragraph',
    children: [
      {
        text: '',
        marks: [] as any[],
      },
    ],
  }

  const defaultValue: Element[] = props.value ? JSON.parse(props.value) : [
    defaultElement
  ]


  // Define our own custom set of helpers for common queries.
  const CustomEditor = {
    // extract current editor's mark contains 'bold' mark
    isBoldMarkActive(editor: Editor): boolean {
      const { selection } = editor
      const activeMarks = Editor.activeMarks(editor)
      return activeMarks.some(mark => mark.type === 'bold')
    },

    isItalicMarkActive(editor: Editor): boolean {
      const { selection } = editor
      const activeMarks = Editor.activeMarks(editor)
      return activeMarks.some(mark => mark.type === 'italic')
    },

    isCodeBlockActive(editor: Editor): NodeEntry | undefined | boolean {
      const { selection } = editor
      const isCode = selection
        ? Editor.match(editor, selection, { type: 'code' })
        : false
      return isCode
    },
  }

  // Create a custom editor plugin function that will augment the editor.
  const withCustom = (editor: Editor) => {
    const { exec, isVoid } = editor

    editor.exec = command => {
      // Define a command to toggle the bold mark formatting.
      if (command.type === 'toggle_bold_mark') {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        // Delegate to the existing `add_mark` and `remove_mark` commands, so that
        // other plugins can override them if they need to still.
        editor.exec({
          type: isActive ? 'remove_mark' : 'add_mark',
          mark: { type: 'bold' },
        })
      }

      if (command.type === 'toggle_italic_mark') {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        // Delegate to the existing `add_mark` and `remove_mark` commands, so that
        // other plugins can override them if they need to still.
        editor.exec({
          type: isActive ? 'remove_mark' : 'add_mark',
          mark: { type: 'italic' },
        })
      }

      // Define a command to toggle the code block formatting.
      else if (command.type === 'toggle_code_block') {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        // There is no `set_nodes` command, so we can transform the editor
        // directly using the helper instead.
        Editor.setNodes(
          editor,
          { type: isActive ? null : 'code' },
          { match: 'block' }
        )
      }

      else if (command.type === 'insert_image') {
        const tempInput = document.createElement('input')
        tempInput.type = 'file'
        tempInput.onchange = (e) => {
          const tempFile: File = (e.target as HTMLInputElement).files[0]
          const imgSrc: string = window.URL.createObjectURL(tempFile);
          const text: Text = { text: '', marks: [] }
          const element: Element = {
            type: 'image', 
            children: [text], 
            src: imgSrc, 
            publicSrc: generateBlogContentPublicImageUrl('1', tempFile.name),
            imageFile: tempFile, // need to remove when saving. extract file into formdata separately
            attributes: {
              onLoad: (e: React.SyntheticEvent) => {
                window.URL.revokeObjectURL(imgSrc)
              },
            }
          }
          const nextDefaultElement: Element = defaultElement
          Editor.insertNodes(editor, element)
          Editor.insertNodes(editor, nextDefaultElement)
        }
        tempInput.click();
      }

      // Otherwise, fall back to the built-in `exec` logic for everything else.
      else {
        exec(command)
      }
    }

    return editor
  }

  // Create a Slate editor object that won't change across renders.
  const editor = React.useMemo(() => withCustom(withReact(createEditor())), [])

  const BoldMark: React.FunctionComponent<CustomElementProps> = props => {
    return <strong {...props.attributes}>{props.children}</strong>
  }


  const ItalicMark: React.FunctionComponent<CustomElementProps> = props => {
    return <i {...props.attributes}>{props.children}</i>
  }

  const CodeElement: React.FunctionComponent<CustomElementProps> = props => {
    return (
      <pre {...props.attributes}>
        <code>{props.children}</code>
      </pre>
    )
  }

  const ImageElement: React.FunctionComponent<ImageCustomElementProps> = props => {
    const figureRef: React.MutableRefObject<HTMLElement> = React.useRef(null)
    const popupRef: React.MutableRefObject<HTMLDivElement> = React.useRef(null)

    const [currentPopupStatus, setPopupStatus] = React.useState<boolean>(false)

    const handleImageLeftAlignClickEvent: React.EventHandler<React.MouseEvent<HTMLDivElement>> = (e) => {
      figureRef.current.style.maxWidth = '50%'
      figureRef.current.style.margin = '0 auto auto auto'
      figureRef.current.style.display = 'inline-block'
      figureRef.current.style.cssFloat = 'left'
    }

    const handleImageCenterAlignClickEvent: React.EventHandler<React.MouseEvent<HTMLDivElement>> = (e) => {
      figureRef.current.style.maxWidth = '50%'
      figureRef.current.style.margin = '0 auto'
      figureRef.current.style.display = 'block'
      figureRef.current.style.cssFloat = 'none'
    }

    const handleImageFullSizeClickEvent: React.EventHandler<React.MouseEvent<HTMLDivElement>> = (e) => {
      figureRef.current.style.maxWidth = '100%'
      figureRef.current.style.margin = '0 auto'
      figureRef.current.style.display = 'block'
      figureRef.current.style.cssFloat = 'none'
    }

    const handleImageRightAlignClickEvent: React.EventHandler<React.MouseEvent<HTMLDivElement>> = (e) => {
      figureRef.current.style.maxWidth = '50%'
      figureRef.current.style.margin = '0 0 0 auto'
      figureRef.current.style.display = 'block'
      figureRef.current.style.cssFloat = 'right'
    }

    const handleImageDisplayClickEvent: React.EventHandler<React.MouseEvent<HTMLElement>> = (e) => {
      //popupRef.current.style.display = 'block'
      setPopupStatus(true)
    }

    React.useEffect(() => {
      const handleImagePopupCloseWhenOutsideClickEvent = (e: Event) => {

        if (figureRef.current.contains(e.target as Node)) {
          return false;
        }
        setPopupStatus(false)
      }
      if (figureRef.current !== null) {
        window.addEventListener('mousedown', handleImagePopupCloseWhenOutsideClickEvent);
      }

      return () => {
        window.removeEventListener('mousedown', handleImagePopupCloseWhenOutsideClickEvent);
      }

    })
    /** need to think how to handle Text at image **/
    /** where to put 'props.children' **/
    return (
      <>
        <figure {...props.attributes} className="editable-figure" ref={figureRef} onClick={handleImageDisplayClickEvent}>
          <div className="editable-image-wrapper">
            <img src={props.element.src} {...props.element.attributes} className="editable-img" />
            {(currentPopupStatus &&
              <div className="popup-img-menu " ref={popupRef}>
                <div className="icon-wrapper popup-img-menu-left-btn" onClick={handleImageLeftAlignClickEvent}>
                  <AiOutlinePicLeft className="icon" />
                </div>
                <div className="icon-wrapper popup-img-menu-center-btn" onClick={handleImageCenterAlignClickEvent}>
                  <AiOutlinePicCenter className="icon" />
                </div>
                <div className="icon-wrapper popup-img-menu-right-btn" onClick={handleImageRightAlignClickEvent}>
                  <AiOutlinePicRight className="icon" />
                </div>
                <div className="icon-wrapper popup-img-menu-full-btn" onClick={handleImageFullSizeClickEvent}>
                  <AiOutlineFullscreen className="icon" />
                </div>
              </div>
            )}
          </div>
          <span>{props.children}</span>
          <figcaption>test caption</figcaption>
        </figure>
      </>
    )
  }


  const renderMark = React.useCallback(props => {
    switch (props.mark.type) {
      case 'bold': {
        return <BoldMark {...props} />
      }
      case 'italic': {
        return <ItalicMark {...props} />
      }
    }
  }, [])

  const DefaultElement: React.FunctionComponent<CustomElementProps> = props => {
    return <p {...props.attributes}>{props.children}</p>
  }

  const renderElement = React.useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'image':
        return <ImageElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])


  return (
    <Slate
      editor={editor}
      defaultValue={defaultValue}
      onChange={value => {
        console.log(value)
        // Save the value to Local Storage.
        const content = JSON.stringify(value)
        localStorage.setItem('content', content)
        props.onChange(content)
        // need to save request every time user change content
        // better to use rxjs to controll how to request
      }}
    >
      <>
        <div
          className="small-icon-wrapper"
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            editor.exec({ type: 'toggle_bold_mark' })
          }}
        >
          <FaBold className="small-icon" />
        </div>
        <div
          className="small-icon-wrapper"
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            editor.exec({ type: 'toggle_code_block' })
          }}
        >
          <FaCode className="small-icon" />
        </div>
        <div
          className="small-icon-wrapper"
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            editor.exec({ type: 'toggle_italic_mark' })
          }}
        >
          <FaItalic className="small-icon" />
        </div>
        <div
          className="small-icon-wrapper"
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            editor.exec({ type: 'insert_image' })
          }}
        >
          <FaImage className="small-icon" />
        </div>
        <Editable
          className="blog-content-editable"
          placeholder={props.placeholder}
          renderElement={renderElement}
          renderMark={renderMark}
          onFocus={props.onFocus}
          name={props.name}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (!event.ctrlKey) {
              return
            }

            switch (event.key) {
              case '`': {
                event.preventDefault()
                editor.exec({ type: 'toggle_code_block' })
                break
              }

              case 'b': {
                event.preventDefault()
                editor.exec({ type: 'toggle_bold_mark' })
                break
              }
            }
          }}
        />
      </>
    </Slate>
  );
}

export default BlogContent;








