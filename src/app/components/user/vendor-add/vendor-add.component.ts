import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import * as atoastr from '../../common/toastr';
import { } from '@types/googlemaps';
// declare var autocomplete: any;

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit, OnDestroy {
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  inserted = false;
  loggedInUserId = '';
  autocomplete: any;
  latitude;
  longitude;
  addVendorCounter = 0;
  source: any;
  componentForm = {
    locality: 'long_name',                     // city
    route: 'long_name',                        // apartment/suite number
    administrative_area_level_1: 'short_name', // state
    postal_code: 'short_name'                  // zipCode
  };
  secondaryApp: any;

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


  constructor(private router: Router, private route: ActivatedRoute, public cd: ChangeDetectorRef) {
    this.loggedInUserId = localStorage.getItem('userId');
    // if (firebase.apps.length > 1) {
    //   firebase.app('Secondary').delete();
    //   location.reload();
    // }

    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
    });
  }

  ngOnInit() {
    const config = {
      apiKey: 'AIzaSyDXFg2G-agmNmslaVOVkbWDIyp7hZVlM7Y',
      authDomain: 'loycard-f138e.firebaseapp.com',
      databaseURL: 'https://loycard-f138e.firebaseio.com',
      projectId: 'loycard-f138e',
      storageBucket: 'loycard-f138e.appspot.com',
      messagingSenderId: '562361582837'
    };
    const hasSeconday = firebase.apps.filter( app => app.name === 'Secondary');
    this.secondaryApp = hasSeconday.length ? hasSeconday[0] : firebase.initializeApp(config, 'Secondary');
    // initialize google map's autocomplete
    this.autocomplete = new google.maps.places.Autocomplete(
      <HTMLInputElement>(document.getElementById('businessAddress')),
      { types: ['geocode'] });

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
  addVendor(formData: NgForm) {

    var that = this;

    if (formData.valid) {
      // const config = {
      //   apiKey: 'AIzaSyDXFg2G-agmNmslaVOVkbWDIyp7hZVlM7Y',
      //   authDomain: 'loycard-f138e.firebaseapp.com',
      //   databaseURL: 'https://loycard-f138e.firebaseio.com',
      //   projectId: 'loycard-f138e',
      //   storageBucket: 'loycard-f138e.appspot.com',
      //   messagingSenderId: '562361582837'
      // };
      // console.log(firebase.apps.length);
      var timeListArray = []
      for (var i=0; i < this.timeSlotList.length; i++) {
        var time = {
          "label": this.timeSlotList[i].label,
          "starttime": this.timeSlotList[i].starttime === 'closed' ||  this.timeSlotList[i].endtime === 'closed' ? 'closed' : this.timeSlotList[i].starttime,
          "starttimezone": this.timeSlotList[i].starttime === 'closed' ||  this.timeSlotList[i].endtime === 'closed' ? '': this.timeSlotList[i].starttimezone,
          "endtime": this.timeSlotList[i].starttime === 'closed' ||  this.timeSlotList[i].endtime === 'closed' ? '' : this.timeSlotList[i].endtime,
          "endtimezone": this.timeSlotList[i].starttime === 'closed' ||  this.timeSlotList[i].endtime === 'closed' ? '': this.timeSlotList[i].endtimezone,
        }
        timeListArray.push(time);
      }

      const secondaryApp = this.secondaryApp;
      // var timeListArray = []
      // for (var item of this.timeSlotList) {
      //   var time = {
      //     "label": item.label,
      //     "starttime": item.starttime === 'closed' ||  item.endtime === 'closed' ? 'closed' : item.starttime,
      //     "starttimezone": item.starttimezone,
      //     "endtime": item.starttime === 'closed' ||  item.endtime === 'closed' ? 'closed' : item.endtime,
      //     "endtimezone": item.endtimezone,
      //   }
      //   timeListArray.push(time);
      // }

      // const hasSeconday = firebase.apps.filter(app => app.name === 'Secondary');
      // let secondaryApp = hasSeconday.length ? hasSeconday[0] : firebase.initializeApp(config, 'Secondary');
      secondaryApp.auth().createUserWithEmailAndPassword(formData.value.email, formData.value.password)
        .then((firebaseUser) => {
          localStorage.setItem('insertedVendorEmail', formData.value.email);
          var facebook = '';
          var twitter = '';
          var googlePlus = '';
          if(formData.value.facebook.toString().trim().indexOf("facebook.com") > -1) {
             facebook = formData.value.facebook.toString().trim();
          } else if (formData.value.facebook.toString().trim() != "") {
              facebook = "https://www.facebook.com/" + formData.value.facebook;
          }

          if(formData.value.twitter.toString().trim().indexOf('twitter.com') > -1) {
             twitter = formData.value.twitter.toString().trim();
          } else if (formData.value.twitter.toString().trim() != "") {
                 twitter = 'https://twitter.com/' + formData.value.twitter;
          }

          if(formData.value.googlePlus.toString().trim().indexOf('plus.google.com') > -1) {
             googlePlus = formData.value.googlePlus.toString().trim();
          } else if (formData.value.googlePlus.toString().trim() != "") {
                 googlePlus = "https://www.plus.google.com/" + formData.value.googlePlus;
          }
          const reqData = {
            email: formData.value.email,
            name: formData.value.name,
            contactno: formData.value.contactno,
            businessName: formData.value.businessname,
            businessAddress: $('#businessAddress').val(),
            latitude: this.latitude,
            longitude: this.longitude,
            apt: $('#route').val(),
            city: $('#locality').val(),
            state: $('#administrative_area_level_1').val(),
            zipcode: $('#postal_code').val(),
            phoneNo: formData.value.phoneNo,
            // facebook: formData.value.facebook.toString().trim() != "" ? "https://www.facebook.com/" + formData.value.facebook : "",
            // twitter: formData.value.twitter.toString().trim() != "" ? "https://twitter.com/" + formData.value.twitter : "",
            // googlePlus: formData.value.googlePlus.toString().trim() != "" ? "https://plus.google.com/" + formData.value.googlePlus : "",
            facebook: facebook,
            twitter: twitter,
            googlePlus: googlePlus,
            website: formData.value.website,
            timeSlots: timeListArray,
            role: 2,
            uid: firebaseUser.uid,
            insertedBy: this.loggedInUserId,
            createdDate: new Date(),
            paid: true
          }

          console.log("reqData", reqData)
          secondaryApp.database().ref('/Role/' + firebaseUser.uid).update(reqData);

          secondaryApp.database().ref('/Vendors/' + firebaseUser.uid).update(reqData);

          if (localStorage.getItem('userrole') === '1') {
            secondaryApp.database().ref('/Representatives/' + this.loggedInUserId + '/vendors/' + firebaseUser.uid).update(reqData);
          }

          localStorage.setItem('insertedVendorId', firebaseUser.uid);

          firebaseUser.updateProfile({
            displayName: formData.value.name
          }).then((success) => {
            if (that.source == 'vendor-list') {
              that.router.navigate(['vendor-list']);
            }
            console.log("DisplayName Updated");
            this.inserted = true;
            if (this.inserted === true) {
              secondaryApp.auth().signOut();
              this.router.navigate(['/vendor-card-add']);
            }
            atoastr.showSuccess('Vendor added successfully');
          }).catch(function (error) {
            console.log("Error updating displayname");
          });
          formData.reset();
          // secondaryApp.delete();
          window.scrollTo(5, 50);
          // firebase.app('[DEFAULT]').delete();
          if (localStorage.getItem('date') == null) {
            localStorage.setItem('date', JSON.stringify(new Date().getTime()));
          }
          let counter;
          if (localStorage.getItem('addVendorCounter') != null) {
            counter = parseInt(localStorage.getItem('addVendorCounter')) + 1;
          } else {
            counter = ++this.addVendorCounter;
          }
          localStorage.setItem('addVendorCounter', counter.toString());
        }).catch(function (error) {
          atoastr.showError(error.message);
        });
    }
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

  ngOnDestroy() {
  }
}
