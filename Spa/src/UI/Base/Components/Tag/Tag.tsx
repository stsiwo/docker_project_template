import * as React from 'react';
import './Tag.scss';
import { TagPropType } from './types';
import { MdClose } from 'react-icons/md';

const Tag: React.FunctionComponent<TagPropType> = (props: TagPropType) => {

  return (
    <div 
      className={`tags-item-wrapper ${props.wrapperStyle} ${props.blackStyle ? 'black-tags-item-wrapper' : ''}`} 
      key={props.name} role='tag-icon'
    >
      <i 
        className={`tags-item-name ${props.nameStyle} ${props.blackStyle ? 'black-tags-item-name' : ''}`}
      >
        #{props.name}
      </i>
    {(props.withCancelBtn && 
      <div className="small-icon-wrapper tags-item-close-icon-wrapper" onClick={props.handleTagDeleteClickEvent} data-tag={props.name}>
        <MdClose className="small-icon" />
      </div>
    )}
    </div>
  );
}

export default Tag;







