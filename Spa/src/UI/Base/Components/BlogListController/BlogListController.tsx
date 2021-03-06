import * as React from 'react';
import './BlogListController.scss';
import { BlogListControllerPropType } from './types';
import { useResponsive } from 'Hooks/Responsive/useResponsive';
import FetchStatus from 'Components/ApiFetch/FetchStatus';
import { ResponseResultStatusEnum } from 'requests/types';
import { MdRefresh, MdCancel, MdSettings } from 'react-icons/md';
import PageLimitSelect from 'Components/Pagination/PageLimitSelect';
import { useAuthContext } from 'Contexts/AuthContext/AuthContext';
import { AiOutlineFileAdd } from 'react-icons/ai'
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { FetchContextEnum } from 'ui/Content/Setting/BlogManagement/BlogManagement';

const BlogListController: React.FunctionComponent<BlogListControllerPropType> = (props: BlogListControllerPropType) => {

  const currentScreenSize = useResponsive()
  const { auth } = useAuthContext()
  const { url, path } = useRouteMatch()

  const hasFetchContext: boolean = (props.curFetchContext) ? true : false

  return (
    <div className="blog-list-controller-wrapper">
      {(!hasFetchContext && 
        <FetchStatus
          currentFetchStatus={props.currentFetchStatus}
          setFetchStatus={props.setFetchStatus}
        />
      )}
      {(hasFetchContext && props.curFetchContext === FetchContextEnum.FETCH &&
        <FetchStatus
          currentFetchStatus={props.currentFetchStatus}
          setFetchStatus={props.setFetchStatus}
        />
      )}
      {(hasFetchContext && props.curFetchContext === FetchContextEnum.DELETE &&
        <FetchStatus
          currentFetchStatus={props.currentDeleteFetchStatus}
          setFetchStatus={props.setDeleteFetchStatus}
          fetchingMsg={"deleting"}
        />
      )}
      <div className="icon-wrapper-row blog-list-controller-refresh">
        {(props.currentFetchStatus.status !== ResponseResultStatusEnum.FETCHING &&
          <div className="icon-wrapper" onClick={props.handleRefreshClickEvent} role="refresh-icon">
            <MdRefresh className="icon" />
          </div>
        )}
        {(props.currentFetchStatus.status === ResponseResultStatusEnum.FETCHING &&
          <div className="icon-wrapper" onClick={props.handleCancelClickEvent} role="cancel-icon">
            <MdCancel className="icon" />
          </div>
        )}
      </div>
      {(currentScreenSize.isLTETablet &&
        <div className="icon-wrapper-row">
          <div className="icon-wrapper" onClick={props.handleFilterSortNavClickEvent} role="setting-icon">
            <MdSettings className="icon" />
          </div>
        </div>
      )}
      {(auth.authed &&
        <Link to={`/setting/blogs/new`} className="aside-new-blog-link" role='new-blog-link'>
          <div className="icon-wrapper-row">
            <div className="icon-wrapper">
              <AiOutlineFileAdd className="icon" />
            </div>
          </div>
        </Link>
      )}
      <PageLimitSelect
        currentPaginationStatus={props.currentPaginationStatus}
        setPaginationStatus={props.setPaginationStatus}
      />
    </div>
  );
}

export default BlogListController;








