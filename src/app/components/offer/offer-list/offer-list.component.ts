import { Component, OnInit } from '@angular/core';
import { OfferService } from '../offer.service';
import { AngularFireList  } from 'angularfire2/database';
import { Observable } from '../../../../../node_modules/rxjs';
import { map } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],

})
export class OfferListComponent implements OnInit {
  offers$;
  offers: any;
  offerLists;

  constructor(private offerService: OfferService) {
    // this.offers$ = this.offerService.getOffers().valueChanges().subscribe(data => {
    //   this.offers = data;
    // });
    // console.log('offerobservable');
    this.offerLists = this.offerService.getOfferList().valueChanges();
    console.log(this.offerLists);
  }

  ngOnInit() {
    this.getOffers();
  }

  getOffers() {
    this.offers = this.offerService.getOfferList().snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
      })
    );
    console.log('get offers', this.offers);
  }

  offerActive(offer, event) {
    // console.log('offer change', offer, event.target.checked);
    this.offerService.updateOfferActive(offer.key, event.target.checked);
  }

}
