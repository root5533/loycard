import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { stripeKey } from '../../../../environments/stripe';
import { PaymentService } from 'app/components/user/payment.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-vendor-card-add',
  templateUrl: './vendor-card-add.component.html',
  styleUrls: ['./vendor-card-add.component.scss']
})
export class VendorCardAddComponent implements OnInit {
  handler: any;
  userId: String;
  membership: any;
  constructor(private pmt: PaymentService, db: AngularFireDatabase) {
      const userId = localStorage.getItem('insertedVendorId');
      this.membership = db.object(`VendorUsers/${userId}/membership`);
  }

  ngOnInit() {
    this.configHandler()
  }
  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'http://crepeguys.ipage.com/assets/img/70_70_2.jpg',
      locale: 'auto',
      token: token => {
        // console.log('token is', token);
        this.pmt.processPayment(token);
      }
    });
    // console.log('handler is ', this.handler);
  }

  openHandler() {
    this.handler.open({
      name: 'Monthly Subscription',
      amount: 4999,
      email: localStorage.getItem('insertedVendorEmail'),
      allowRememberMe: false
    });
  }

  freeSubscribe() {
    this.pmt.freeSubscribe();
  }

}
