import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class OfferService {

  offers: AngularFireList<any> = null;

  constructor(private afDb: AngularFireDatabase) {
    const vendorid = localStorage.getItem('userId');
    this.offers = this.afDb.list('/LoyaltyOffers', ref => ref.orderByChild('vendorID').equalTo(vendorid));
  }

  createOffer(offer){
    return this.afDb.list('/LoyaltyOffers').push(offer);
  }

  getOffers(){ // return offers of the current vendor
    const vendorid = localStorage.getItem('userId');
    return this.afDb.list('/LoyaltyOffers',ref => ref.orderByChild('vendorID').equalTo(vendorid));
  }

  getOfferList(): AngularFireList<any> {
    return this.offers;
  }

  updateOfferActive(key, value) {
    this.offers.update(key, { active: value });
  }

}
