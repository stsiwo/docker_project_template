import * as React from 'react';
import './Setting.scss';
import { useResponsiveComponent } from '../../Base/Hooks/ResponsiveComponentHook';
import { useCssGlobalContext } from '../../Base/Context/CssGlobalContext/CssGlobalContext';
import { Link, Route, Switch } from 'react-router-dom';
import Profile from './Profile/Profile';
import { useRouteMatch } from 'react-router';
import SettingHome from './SettingHome/SettingHome';
import BlogManagement from './BlogManagement/BlogManagement';
import NewBlog from './BlogManagement/NewBlog/NewBlog';
import UpdateBlog from './BlogManagement/UpdateBlog/UpdateBlog';
import { AuthRoute } from '../../Base/Components/AuthRoute';

declare type SettingNavItemType = {
  name: string
  label: string
}


const Setting: React.FunctionComponent<{}> = (props: {}) => {

  const settingNavList: SettingNavItemType[] = [
    {
      name: 'profile',
      label: 'Profile'
    },
    {
      name: 'blogs',
      label: 'Blogs'
    },
  ]

  const renderSettingContentList = (): React.ReactNode => {
    return settingNavList.map((settingItem: SettingNavItemType) => {
      return (
        <li className="setting-list-li" key={settingItem.name}>
          <Link to={`${url}/${settingItem.name}`}>
            {settingItem.label}
          </Link>
        </li>
      )
    })
  }

  let { path, url } = useRouteMatch();

  console.log(path)

  return (
    <div className="setting-wrapper">
      <aside className="setting-list-wrapper">
        <ul className="setting-list-ul">
          {renderSettingContentList()}
        </ul>
      </aside>
      <article className="setting-content">
        {/** update for PrivateAuthRoute for authenticated user to access **/}
        <AuthRoute exact path={`${path}`} component={SettingHome} />
        <AuthRoute exact path={`${path}/profile`} component={Profile} />
        <AuthRoute exact path={`${path}/blogs`} component={BlogManagement} />
        <AuthRoute exact path={`${path}/blogs/new`} component={NewBlog} />
        <AuthRoute exact path={`${path}/blogs/update/:blogId`} component={UpdateBlog} />
      </article>
    </div>
  );
}

export default Setting;

