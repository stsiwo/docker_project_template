import * as React from 'react';
import './FetchStatus.scss';
import { FetchStatusPropType } from './types';
import { ResponseResultStatusEnum } from 'requests/types';
var debug = require('debug')('ui:FetchStatus')

const FetchStatus: React.FunctionComponent<FetchStatusPropType> = (props: FetchStatusPropType) => {
  debug('Component start')

  /** 
   * re-implement this
   * close btn should be close this <FetchStatus> component. not for modify any currentFetchStatus
   **/
  const handleFetchStatusCloseClickEvent: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    debug('start handle fetch status close click event')
    props.setFetchStatus({
      status: ResponseResultStatusEnum.INITIAL
    })
  }

  return (
    <div className="fetch-status-wrapper">
      {(props.currentFetchStatus.status === ResponseResultStatusEnum.FETCHING && <h3 className="fetch-status-title">fetching ...</h3>)}
      {(props.currentFetchStatus.status === ResponseResultStatusEnum.SUCCESS && <h3 className="fetch-status-title">fetching success</h3>)}
      {(props.currentFetchStatus.status === ResponseResultStatusEnum.FAILURE && <h3 className="fetch-status-title">fetching failed</h3>)}
      {(props.currentFetchStatus.errorMsg && <p>{props.currentFetchStatus.errorMsg}</p>)}
      <button className="fetch-status-close-btn" onClick={handleFetchStatusCloseClickEvent}>&#10006;</button>
    </div>
  );
}

export default FetchStatus;






