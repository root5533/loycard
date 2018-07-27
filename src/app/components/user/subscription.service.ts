import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
@Injectable()
export class SubscriptionService {
  userId: string;
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth,
    private router: Router, private route: ActivatedRoute) {
      this.userId = this.route.snapshot.paramMap.get('id');
    }

  processPayment(token: any) {
    console.log('subs token: ' + token);
    this.db.object(`/Vendors/${this.userId}`)
      .update({ token: token.id, status: 'paid' });

    return this.db.object(`/VendorUsers/${this.userId}/membership`)
      .update({ token: token.id, status: 'active' })
      .then((resp) => {
        alert('Card Saved: ' + resp);
        // if(firebase.apps.length > 1){
        //   firebase.app('Secondary').delete();
        // }
        // if (localStorage.getItem('userrole') !== '2') {
        //   this.router.navigate(['/vendor-list']);
        // }
      }).catch((err) => {
        alert('Error');
      });
  }

}
