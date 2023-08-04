import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/pages/dashboard/' }]
        },
        
       
      
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                
                
                {
                    label: 'Employe',
                    icon: 'pi pi-fw pi-user',
                    to: '/pages/crud/employe'
                },
                {
                    label: 'Bus',
                    icon: 'pi pi-fw pi-bookmark',
                    to: '/pages/crud/bus'
                },

                {
                    label: 'Station',
                    icon: 'pi pi-fw pi-bookmark',
                    to: '/pages/crud/station'
                },

                {
                    label: 'Itenerary',
                    icon: 'pi pi-fw pi-bookmark',
                    to: '/pages/crud/itenerary'
                },
               
                {
                    label: 'Reservation list',
                    icon: 'pi pi-fw pi-list',
                    to: '/pages/crud/reservation'
                },
                
                

                
               
            
            ]
        },
       
       
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

            
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
