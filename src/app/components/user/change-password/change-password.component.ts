import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Location } from '@angular/common';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  passchangesuccess: boolean = false;
  passchangefail: boolean = false;
  constructor(private afAuth: AngularFireAuth, private router: Router,
    private location: Location) { }

  updatePassword(formData: NgForm) {
    if (formData.valid) {
      var user = firebase.auth().currentUser;
      var newPassword = formData.value.password;

      console.log(user)
      // user.updatePassword(newPassword).then(function() {
      //   this.passchangesuccess = true;
      // }).catch(function(error) {
      //   this.passchangefail = true;
      //   console.log(error);
      // });
      user.updatePassword(newPassword).then((value) => {
        this.passchangesuccess = true;
      }).catch((error) => {
        this.passchangefail = true;
        this.logout();
      })
    }
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

}
