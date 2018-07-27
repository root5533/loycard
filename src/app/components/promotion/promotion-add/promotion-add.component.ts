import { Component } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-add',
  templateUrl: './promotion-add.component.html',
  styleUrls: ['./promotion-add.component.scss'],
  providers: [DatePipe]
})
export class PromotionAddComponent {
  inserted = false;
  private date;
  constructor(private promotionService: PromotionService, private datePipe: DatePipe,
    private http: HttpClient) {}

  addPromotion(formData: NgForm) {
    const curdate = Date.now();
    const creationDate = this.datePipe.transform(curdate, 'dd/MM/yyyy');

    const obj = {};
    obj['title'] = formData.value.title;
    obj['description'] = formData.value.description;
    obj['expiryDate'] = formData.value.expiryDate;
    obj['vendorId'] = localStorage.getItem('userId');
    obj['creationDate'] = creationDate;
    this.promotionService.createPromotion(obj)
        .then((resp) => {
          console.log('promotion>>>' + resp);
          this.triggerPushToCustomer(localStorage.getItem('userId'), resp.key);
        // this.inserted = true;
        // window.scrollTo(5, 50);
        formData.reset();
        // this.router.navigate(['/offer-list']);
      });
  }

  triggerPushToCustomer(vendorId, promoId) {
    const url = 'https://us-central1-loycard-f138e.cloudfunctions.net/pushToCustomer';
    const headers =  {
      headers: new  HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    const reqOb = {
      vendorId: vendorId,
      promoId: promoId
    }

    return this.http.post(url, reqOb, headers)
    .toPromise()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }
}
