import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

import { ISubscription, Subscription } from 'rxjs/Subscription';
// declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  hasError = false;
  private subscription: Subscription;

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase,
    private router: Router) {
      this.subscription = this.afAuth.authState.subscribe(user => {
        if (user) {
          if (localStorage.getItem('userrole') && localStorage.getItem('userName')) {
            this.router.navigate(['/']);
          }
        }
      });
  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('menu-expanded');   // remove the class
  }

  doLogin(formData: NgForm) {
    if (formData.valid) {
      const email    = formData.value.email;
      const password = formData.value.password;
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.afDb.object('/Role/' + user.uid).update({
          email: user.email
        }).then((success) => {
          this.subscription = this.afDb.object('/Role/' + user.uid).valueChanges()
              .subscribe( (roleObj) => {
                console.log(roleObj);
                if ('role' in roleObj && 'name' in roleObj) {
                  localStorage.setItem('userrole', roleObj['role']);
                  localStorage.setItem('userName', roleObj['name']);
                  if ('profilePic' in roleObj) {
                    localStorage.setItem('profilePic', roleObj['profilePic']);
                  }
                  /* set/add query */
                  /* this.afDb.object('Role/' + roleObj['uid']).set({
                     signedIn: "abc"
                   });*/
                   /*update query */
                   var postData = {
                      signedIn: "def"
                    };
                   // Get a key for a new Post.
                    /*var newPostKey = this.afDb.createPushId();
                    var updates = {};
                    updates['Role/cz7xQtyBILeTGUjxLuSpANLWk8I2/' + newPostKey] = postData;
                    this.afDb.object('Role/cz7xQtyBILeTGUjxLuSpANLWk8I2/' + newPostKey).update(updates);*/
                    var d = new Date(),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    var signedInDate = [year, month, day].join('/');

                    this.afDb.object('Role/' + roleObj['uid']).update({
                      signedIn: signedInDate
                    });

                    this.router.navigate(['/dashboard']);
                    
                }
              });
              // this.subscription.unsubscribe();
        })
        localStorage.setItem('userId', user.uid);
      })
      .catch(error => {
        this.hasError = true;
      });
    } else {
      console.log('error');
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
     this.subscription.unsubscribe();
    }
  }
}
