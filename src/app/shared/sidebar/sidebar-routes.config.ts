import { RouteInfo } from './sidebar.metadata';
var urole = localStorage.getItem('userrole');
export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: 'nav-item', badge: '', badgeClass: '', isExternalLink: false, isNavHeader: false, submenu: []
    },
    {
        path: '', title: 'Manage Users', icon: 'ft-users', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false, isNavHeader: false,
        submenu: [          
            { path: '/salesrep-add', title: 'Add Sales Rep.', icon: '', class: (urole=="0") ? 'display_true':'display_false', badge: '', badgeClass: '', isExternalLink: false, isNavHeader: false, submenu: [] },
            { path: '/vendor-add', title: 'Add Vendor', icon: '',  class: (urole=="0" || urole=="1")?'display_true': 'display_false', badge: '', badgeClass: '', isExternalLink: false, isNavHeader: false, submenu: [] },
            { path: '/vendor-list', title: 'Vendor List', icon: '',  class: 'display_true', badge: '', badgeClass: '', isExternalLink: false, isNavHeader: false, submenu: [] }
        ]
    }
    

];
