import { Component, OnInit } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { NgForm, NgModel } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { FormsModule } from '@angular/forms'
import {Router} from '@angular/router';
import * as atoastr from '../../common/toastr';
import { environment } from '../../../../environments/environment';
import { stripeKey } from '../../../../environments/stripe';
import { PaymentService } from '../payment.service';
import 'rxjs/add/operator/take';
@Component({
  selector: 'app-update-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userRole: String = '';
  userId: String = '';
  user: any = {};
  config = {};
  profilePic: '';
  secondaryApp: any;

  url;
  handler: any;

  userProfilePic = '';
  hasprofilePic = false;

  // google maps auto complete address
  autocomplete: any;
  latitude;
  longitude;
  componentForm = {
    locality: 'long_name',                     // city
    route: 'long_name',                        // apartment/suite number
    administrative_area_level_1: 'short_name', // state
    postal_code: 'short_name'                  // zipCode
  };

  timeList = [
    {
      "value": "closed",
      "text": "Closed"
    },
    {
      "value": "1",
      "text": "1"
    },
    {
      "value": "2",
      "text": "2"
    },
    {
      "value": "3",
      "text": "3"
    },
    {
      "value": "4",
      "text": "4"
    },
    {
      "value": "5",
      "text": "5"
    },
    {
      "value": "6",
      "text": "6"
    },
    {
      "value": "7",
      "text": "7"
    },
    {
      "value": "8",
      "text": "8"
    },
    {
      "value": "9",
      "text": "9"
    },
    {
      "value": "10",
      "text": "10"
    },
    {
      "value": "11",
      "text": "11"
    },
    {
      "value": "12",
      "text": "12"
    }
  ]

  timeZoneList = [
    {
      "value": "am",
      "name": "am"
    },
    {
      "value": "pm",
      "name": "pm"
    }
  ]

  timeSlotList = [
    {
      "label": "Sunday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',
    },
    {
      "label": "Monday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',
    },
    {
      "label": "Tuesday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',

    },
    {
      "label": "Wednesday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',

    },
    {
      "label": "Thursday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',

    },
    {
      "label": "Friday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',
    }, {
      "label": "Saturday",
      "starttime": '',
      "starttimezone": '',
      "endtime": '',
      "endtimezone": '',
    }
  ]

  constructor(private afDB: AngularFireDatabase, private router: Router, private pmt: PaymentService, private http: HttpClient) {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userrole');
    if (localStorage.getItem('profilePic') != null) {
      this.userProfilePic = localStorage.getItem('profilePic');
      this.hasprofilePic = true;
    }

    // get user details
    afDB.object(`Role/${this.userId}`)
      .valueChanges()
      .subscribe(item => {
        const array = item['timeSlots'];
       array.forEach((ele) => {
        ele.label = ele.label;
        ele.starttime = ele.starttime === 'closed' || ele.endtime === 'closed' ? 'closed' : ele.starttime;
        ele.starttimezone = ele.starttime === 'closed' || ele.endtime === 'closed' ? '' : ele.starttimezone;
        ele.endtime = ele.starttime === 'closed' || ele.endtime === 'closed' ? 'closed' : ele.endtime;
        ele.endtimezone = ele.starttime === 'closed' || ele.endtime === 'closed' ? '' : ele.endtimezone;
      })
      item['timeSlots'] = array;

        this.user = item;
        this.latitude = item['latitude'];
        this.longitude = item['longitude'];
        $('#profile-pic').attr('src', _.get(item, 'profilePic'));
      });

    // get membership status
    afDB.object(`VendorUsers/${this.userId}/membership/status`)
      .valueChanges()
      .subscribe(resp => {
        this.user.userStatus = resp;
      });
  }

  ngOnInit() {
    this.config = {
      apiKey: 'AIzaSyDXFg2G-agmNmslaVOVkbWDIyp7hZVlM7Y',
      authDomain: 'loycard-f138e.firebaseapp.com',
      databaseURL: 'https://loycard-f138e.firebaseio.com',
      projectId: 'loycard-f138e',
      storageBucket: 'loycard-f138e.appspot.com',
      messagingSenderId: '562361582837'
    };

    this.configHandler();
    const hasSeconday = firebase.apps.filter( app => app.name === 'Secondary');
    this.secondaryApp = hasSeconday.length ? hasSeconday[0] : firebase.initializeApp(this.config, 'Secondary');

    // initialize google map's autocomplete
    this.autocomplete  = new google.maps.places.Autocomplete(
      <HTMLInputElement>(document.getElementById('businessAddress')),
      {types: ['geocode']});

    // event listener
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }
  onBusinessAddressChange(e) {
    const businessAddress = e.currentTarget.value;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace();
    this.latitude = place.geometry.location.lat();
    this.longitude = place.geometry.location.lng();
    console.log('=====place: ', place);
    for (const component in this.componentForm) {
      if (this.componentForm.hasOwnProperty(component)) {
        $(`#${component}`).val('');
        // $(`#${component}`).attr('disabled', 'false');
      }
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (this.componentForm[addressType]) {
        const val = place.address_components[i][this.componentForm[addressType]];
        $(`#${addressType}`).val(val);
      }
    }
  }

  updateContactInfo(formData: NgForm) {
    if (formData.valid) {
      const $contactInfoForm = $('form#contact-info');
      const formValues = formData.value;
      const req = {
        name: formValues.name,
        email: _.get(this.user, 'email'), // not changeable in form
        contactno: formValues.contactno
      }

      this.secondaryApp.database().ref(`/Role/${this.userId}`).update(req)
      .then(() => {
        if (this.userRole === '1') {
          this.updateRepresentativesTable(req);
        } else if (this.userRole === '2') {
          this.updateVendorsTable(req);
        } else {
          atoastr.showSuccess('Updated contact info');
        }
        this.router.navigate(['/profile']);
      }).catch((err) => {
        atoastr.showError('Failed to update contact info');
        console.log('contactInfo update error: ' + err);
      })
    }
  }

  updateRepresentativesTable(req) {

    this.secondaryApp.database().ref(`/Representatives/${this.userId}`).update(req)
      .then((resp) => {
        atoastr.showSuccess('Updated info');
        this.router.navigate(['/profile']);
      }).catch((err) => {
        atoastr.showError('Failed to update');
        console.log('ERROR (update representatives) : ', err);
      })
  }

  updateBusinessInfo(formData: NgForm) {
    if (formData.valid) {
      const formValues = formData.value;
      var timeListArray = []
      for (var i=0; i < this.timeSlotList.length; i++) {
        var time = {
          "label": this.user.timeSlots[i].label,
          "starttime": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? 'closed' : this.user.timeSlots[i].starttime,
          "starttimezone": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? '': this.user.timeSlots[i].starttimezone,
          "endtime": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? '' : this.user.timeSlots[i].endtime,
          "endtimezone": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? '': this.user.timeSlots[i].endtimezone,
        }
        timeListArray.push(time);
      }
      // var timeListArray = []
      // for (var i=0; i < this.timeSlotList.length; i++) {
      //   var time = {
      //     "label": this.user.timeSlots[i].label,
      //     "starttime": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? 'closed' : this.user.timeSlots[i].starttime,
      //     "starttimezone": this.user.timeSlots[i].starttimezone,
      //     "endtime": this.user.timeSlots[i].starttime === 'closed' ||  this.user.timeSlots[i].endtime === 'closed' ? 'closed' : this.user.timeSlots[i].endtime,
      //     "endtimezone": this.user.timeSlots[i].endtimezone,
      //   }
      //   timeListArray.push(time);
      // }
      const req = {
        businessName: formValues.businessName,
        businessAddress: $('#businessAddress').val(),
        latitude: this.latitude,
        longitude: this.longitude,
        apt: $('#route').val(),
        city: $('#locality').val(),
        state: $('#administrative_area_level_1').val(),
        zipcode: $('#postal_code').val(),
        facebook: formData.value.facebook.toString().trim() != "" ? "https://www.facebook.com/" + formData.value.facebook : "",
        twitter: formData.value.twitter.toString().trim() != "" ? "https://twitter.com/" + formData.value.twitter : "",
        googlePlus: formData.value.googlePlus.toString().trim() != "" ? "https://plus.google.com/" + formData.value.googlePlus : "",
        website: formData.value.website,
        timeSlots: timeListArray,
      }

      this.secondaryApp.database().ref(`/Role/${this.userId}`).update(req)
      .then(() => {
        this.updateVendorsTable(req);
        atoastr.showSuccess('Updated business info');
      }).catch((err) => {
        atoastr.showError('Failed to update business info');
        console.log('Business Info update error: ' + err);
      })
    }
  }
  updateVendorsTable(req) {

    this.secondaryApp.database().ref(`/Vendors/${this.userId}`).update(req)
      .then((resp) => {
        atoastr.showSuccess('Updated info');
        this.router.navigate(['/profile']);
      }).catch((err) => {
        atoastr.showError('Failed to update');
        console.log('ERROR (update business/profilePic) : ', err);
      })
  }
  updateProfilePicture(formData: NgForm) {
   if (formData.valid) {
      const storageRef = firebase.storage().ref();
      const profilePicRef = storageRef.child(`/images/${this.userId}/profilepic`);

      const fileInput: HTMLInputElement = <HTMLInputElement>document.querySelector('#file');
      const file = fileInput.files[0];
      if (file ) {
        const metadata = { contentType: file.type };
        profilePicRef.put(file, metadata)
          .then((resp) => {
            return resp;
          }).then((resp) => {
            $('#profile-pic').attr('src', resp.downloadURL);
            const req = { profilePic: resp.downloadURL };
            localStorage.setItem('profilePic', resp.downloadURL);
            this.secondaryApp.database().ref('/Role/' + this.userId).update(req);
            return req;
          }).then((req) => {
            this.updateVendorsTable(req);
          }).catch((err) => {
            atoastr.showSuccess('Failed to update profile picture');
            console.log('ERROR: ' + (err.code || err.message ));
          });
        } else {
          console.log('File is not chosen!');
          alert('Please select a file');
      }
    }
  }
  onClickCancel() {
    this.router.navigate(['/dashboard']);
  }
  onChangefile(event: any) {
    // console.log(event);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ( ev: any) => {
        this.url = ev.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'http://invertemotech.com/loycard/Loycard_70_70.jpg',
      locale: 'auto',
      token: token => {
       // console.log(token);
        this.pmt.processPayment(token);
      }
    });
  }

  openHandler() {
    this.handler.open({
      name: 'Monthly Subscription',
      amount: 4999
    });
  }

  cancelSubscription() {
    this.afDB.object(`/VendorUsers/${this.userId}/membership`).valueChanges()
      .take(1)
      .subscribe((resp: any) => {
        const stripeSubId = resp.stripeSubId;
        this.triggerCancelSubscription(stripeSubId);
      })
  }

 triggerCancelSubscription (stripeSubId) {
    const cancelurl = 'https://us-central1-loycard-f138e.cloudfunctions.net/cancelSubscription';
    const headers =  {
      headers: new  HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    const reqOb = {
      stripeSubId: stripeSubId
    }

    return this.http.post(cancelurl, reqOb, headers)
      .toPromise()
      .then(resp => {
        console.log('--------', resp);
        const req = {
          status: 'inactive',
          token: ''
        }
        this.secondaryApp.database().ref(`/VendorUsers/${this.userId}/membership`)
        .update(req)
        .then(resp2 => {
          console.log('DB updated with subscription cancelled', resp2);
          atoastr.showSuccess('Subscription was cancelled!');
        });
      })
      .catch(err => {
        atoastr.showError('Cancel Subscription Error');
      })
 }

 onChangeStartTime(item) {
  if (item.starttime === 'closed') {
    item.endtime = 'closed';
    return true;
  }
}

onChangeEndTime(item) {
  if (item.endtime === 'closed') {
    item.starttime = 'closed';
    return true;
  }
}
}
