import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from '@angular/router';
import { Broadcaster } from '../broadcaster';
declare var $: any;
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
    // public menuItems: any[];
    userRole: string = null;
    isVendor: boolean;
    constructor(private router: Router, @Inject(DOCUMENT) private document: Document,
        private route: ActivatedRoute, private broadcaster: Broadcaster) {
        this.userRole = localStorage.getItem('userrole');
        if (this.userRole === '2') {
            this.isVendor = true;
        }
    }
    ngOnInit() {
      $.getScript('./assets/app-assets/js/core/app-menu.js');
      this.document.body.classList.add('menu-collapsed');
      this.initLeftSidebar();
    }
    toggleSideBarMenu () {
      if (window.innerWidth < 768) {
        console.log('test');
        this.broadcaster.broadcast('toggle_sidebar_menu');
      }
    }
    initLeftSidebar() {
      setTimeout(function() {
        console.log('-------Inside setTimeOut: ----------');
        // $.app.menu.toggle()
      }, 2000);
    }
    onClickMenuContent(e) {
      // setTimeout(function() {
      //   // $.app.menu.collapse('hide');
      // }, 2000);
    }
}
