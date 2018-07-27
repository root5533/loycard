import { Component, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Location } from '@angular/common';
import { Broadcaster } from '../broadcaster';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnDestroy {
    userEmail: String = '';
    userName: String = '';
    profilePic: String = '';
    hasProfilePic = false;
    @ViewChild('toggleSidemenuId') toggleSidemenu: ElementRef;
    private subscription: ISubscription;
    constructor(private afAuth: AngularFireAuth, private router: Router,
        private location: Location, private broadcaster: Broadcaster) {
            this.userName = localStorage.getItem('userName');
            if (localStorage.getItem('profilePic') != null) {
                this.profilePic = localStorage.getItem('profilePic');
                this.hasProfilePic = true;
            }
            this.subscription = afAuth.authState.subscribe(
                user => {
                    this.userEmail = user.email;
                }
            );

            this.broadcaster.on<any>('toggle_sidebar_menu').subscribe((data) => {
                let el: HTMLElement = this.toggleSidemenu.nativeElement as HTMLElement;
                el.click();
            })
            
    }

    logout() {
        this.afAuth.auth.signOut();
        localStorage.removeItem('userrole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        if (localStorage.getItem('profilePic') != null) {
            localStorage.removeItem('profilePic');
        }
        if (localStorage.getItem('insertedVendorId') != null) {
            localStorage.removeItem('insertedVendorId');
        }
        if (localStorage.getItem('addVendorCounter') != null) {
            localStorage.removeItem('addVendorCounter');
        }
        if (localStorage.getItem('date') != null) {
            localStorage.removeItem('date');
        }
        this.location.replaceState('/'); // clears browser history so they can't navigate with back button
        this.router.navigate(['/login']);

      
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
