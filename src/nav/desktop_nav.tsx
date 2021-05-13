/* eslint-disable @typescript-eslint/no-unused-vars */
import {Layout, Menu} from 'antd'
import {Const} from '../const'
import {navIcons, pageNames, getNavItemStyle, persistentComponents, getAppBar} from './dynamic_main_nav'
import {useState} from 'react'
import './desktop_nav.css'

import Sider from 'antd/lib/layout/Sider'
import { getActionsCS, usePageName } from '../hooks/cargo_store'
// dont use this slider, it will break layout V
//const {Sider} = Layout
const cs = getActionsCS()

export const DesktopNav = () => {
  const [collapsed, setCollapsed] = useState(true)
  const pageName = usePageName()

  return (
  <>
    {getAppBar(pageName)}
    <Layout style={{backgroundColor: 'white'}}>
      <Sider
        style={{
          zIndex: 1,
          backgroundColor: '#383838',
          minHeight: '100%',
          background: '#383838',
          overflow: 'auto',
          height: '100%',
          position: 'fixed',
          left: 0,
        }}
        width='150'
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed((s) => !s)}
      >
        <Menu
          style={{
            height: '100%',
            background: '#383838',
            borderRight: '1px solid #383838',
            paddingTop: '10px',
          }}
          mode="inline"
          defaultSelectedKeys={[pageName]}
          onClick={(x: any) => cs.putPageName(String(x.key))}
        >
          {pageNames.map((name) => (
            <Menu.Item
              style={{
                backgroundColor: '#383838',
                color: name === pageName ? 'white' : '#737373',
              }}
              icon={navIcons[getNavItemStyle(name, pageName)][name]}
              key={name}
            >
              {collapsed ? null : name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <div style={{paddingLeft: collapsed ? '80px' : '150px'}}>{persistentComponents[pageName]}</div>
    </Layout>
    </>
  )
}
