import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class PromotionService {

  constructor(private afDb: AngularFireDatabase) { }

  createPromotion(promotion) {
    return this.afDb.list('/Promotions').push(promotion);
  }

  getPromotions() {
    const vendorid = localStorage.getItem('userId');
    return this.afDb.list('/Promotions', ref => ref.orderByChild('vendorId').equalTo(vendorid));
  }

}
