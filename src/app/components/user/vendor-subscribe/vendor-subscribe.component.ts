import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { stripeKey } from '../../../../environments/stripe';
import { SubscriptionService } from '../subscription.service';
@Component({
  selector: 'app-vendor-subscribe',
  templateUrl: './vendor-subscribe.component.html',
  styleUrls: ['./vendor-subscribe.component.scss']
})
export class VendorSubscribeComponent implements OnInit {
  handler: any;
  userId: String;
  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.configHandler()
  }
  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'http://invertemotech.com/loycard/Loycard_70_70.jpg',
      locale: 'auto',
      token: token => {
       // console.log(token);
        this.subscriptionService.processPayment(token);
      }
    });
  }
  openHandler() {
    this.handler.open({
      name: 'Monthly Subscription',
      amount: 4999
    });
  }

}
