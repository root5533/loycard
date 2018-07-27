import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OfferService } from '../offer.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
@Component({
  selector: 'app-offer-add',
  templateUrl: './offer-add.component.html',
  styleUrls: ['./offer-add.component.scss']
})
export class OfferAddComponent implements OnInit {
  inserted = false;
  config = {};
  offerPic: '';
  secondaryApp: any;
  constructor(private offerService: OfferService, private router: Router) { }

  ngOnInit() {
    this.config = {
      apiKey: 'AIzaSyDXFg2G-agmNmslaVOVkbWDIyp7hZVlM7Y',
      authDomain: 'loycard-f138e.firebaseapp.com',
      databaseURL: 'https://loycard-f138e.firebaseio.com',
      projectId: 'loycard-f138e',
      storageBucket: 'loycard-f138e.appspot.com',
      messagingSenderId: '562361582837'
    };
    const hasSeconday = firebase.apps.filter( app => app.name === 'Secondary');
    this.secondaryApp = hasSeconday.length ? hasSeconday[0] : firebase.initializeApp(this.config, 'Secondary');
  }
  addOffer(formData: NgForm) {
    // console.log(formData.value);
    const obj = {};
    obj['description'] = formData.value.description;
    obj['purchasesPerReward'] = String(formData.value.purchase);
    obj['reward'] = formData.value.reward;
    obj['vendorID'] = localStorage.getItem('userId');
    obj['active'] = true;
    this.offerService.createOffer(obj)
                     .then((resp) => {
                      // console.log(success);
                      this.inserted = true;
                      window.scrollTo(5, 50);
                      formData.reset();
                     // this.router.navigate(['/offer-list']);
                      this.updateProfilePicture(resp.key);
                     });
  }

  updateProfilePicture(key) {

       const storageRef = firebase.storage().ref();
       const profilePicRef = storageRef.child(`/images/offers/offerpic`);

       const fileInput: HTMLInputElement = <HTMLInputElement>document.querySelector('#file');
       const file = fileInput.files[0];
       if (file ) {
         const metadata = { contentType: file.type };
         profilePicRef.put(file, metadata)
           .then((resp) => {
             return resp;
           }).then((resp) => {
            // $('#profile-pic').attr('src', resp.downloadURL);
             this.secondaryApp.database().ref('/LoyaltyOffers/' + key).update({
               offerPic: resp.downloadURL
             });
           }).then(() => {
             // this.router.navigate(['/dashboard']);
             alert('success');
           }).catch((err) => {
             alert('ERROR: ' + (err.code || err.message ));
           });
         } else {
           console.log('File is not chosen!');
           alert('Please select a file');
       }

   }

}
