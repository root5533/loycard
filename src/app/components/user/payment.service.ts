import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Injectable()
export class PaymentService {
  userId: string;
  membership: any;
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth,
    private router: Router) {
    if (localStorage.getItem('userrole') !== '2') {
      this.userId = localStorage.getItem('insertedVendorId');
    }
    if ( localStorage.getItem('userrole') === '2') {
      this.userId = localStorage.getItem('userId');
    }
  }

  processPayment(token: any) {
    // console.log('subs token: ' + token);
    this.db.object(`/Vendors/${this.userId}`)
      .update({ token: token.id, status: 'paid' });

    return this.db.object(`/VendorUsers/${this.userId}/membership`)
      .update({ token: token.id, status: 'active' })
      .then((resp) => {
        alert('Card Saved:');
        // if(firebase.apps.length > 1){
        //   firebase.app('Secondary').delete();
        // }
        if (localStorage.getItem('userrole') !== '2') {
          this.router.navigate(['/vendor-list']);
        }
      }).catch((err) => {
        alert('Error');
      });
  }

  freeSubscribe() {
    this.db.object(`/Vendors/${this.userId}`)
      .update({ status: 'free' });

    return this.db.object(`/VendorUsers/${this.userId}/membership`)
      .update({status: 'active'})
      .then((response) => {
        alert('Subscribed for free');
        if (localStorage.getItem('userrole') !== '2') {
          this.router.navigate(['/vendor-list']);
        }
      }).catch((err) => {
        alert('Error');
      });
  }

}
