import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {
  promotions$;
  promotions;
  allPromotions: any;
  date = new Date();

  constructor(private promotionService: PromotionService) {
    this.promotions$ = this.promotionService.getPromotions().valueChanges().subscribe(data => {
      this.allPromotions = data;
      this.promotions = this.allPromotions.filter((prom) => {
        if (prom.expiryDate) {
          return new Date(prom.expiryDate) > this.date;
        }
        else {
          return true;
        }
      });
      // console.log(this.offers$);
    });
  }

  ngOnInit() {
  }

}
