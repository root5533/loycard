import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../vendor.service';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as atoastr from '../../common/toastr';
import {} from '@types/googlemaps';

@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.scss']
})
export class VendorEditComponent implements OnInit {
  vendor: any = {};
  config = {};
  config2 = {};
  secondaryApp: any;
  thirdApp: any;
  userRole: String = '';
  vendorIdFromRoute;
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
  constructor(private route: ActivatedRoute, private vendorService: VendorService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRole = localStorage.getItem('userrole');
    // console.log('id: ' + this.route.snapshot.paramMap.get('id'));
    // this.vendorIdFromRoute = this.route.snapshot.paramMap.get('id');
    if (id) {
     this.vendorService.getById(id).valueChanges().take(1).subscribe((v) => {

      const array = v['timeSlots'];
       array.forEach((item) => {
        item.label = item.label;
        item.starttime = item.starttime === 'closed' || item.endtime === 'closed' ? 'closed' : item.starttime;
        item.starttimezone = item.starttime === 'closed' || item.endtime === 'closed' ? '' : item.starttimezone;
        item.endtime = item.starttime === 'closed' || item.endtime === 'closed' ? 'closed' : item.endtime;
        item.endtimezone = item.starttime === 'closed' || item.endtime === 'closed' ? '' : item.endtimezone;
      })
      v['timeSlots'] = array;
      this.vendor = v;
       this.latitude = v['latitude'];
       this.longitude = v['longitude'];
     });
    }
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
    const hasSeconday = firebase.apps.filter( app => app.name === 'Secondary');
    this.secondaryApp = hasSeconday.length ? hasSeconday[0] : firebase.initializeApp(this.config, 'Secondary');

    this.config2 = {
      apiKey: 'AIzaSyDXFg2G-agmNmslaVOVkbWDIyp7hZVlM7Y',
      authDomain: 'loycard-f138e.firebaseapp.com',
      databaseURL: 'https://loycard-f138e.firebaseio.com',
      projectId: 'loycard-f138e',
      storageBucket: 'loycard-f138e.appspot.com',
      messagingSenderId: '562361582837'
    };
    const hasThirdApp = firebase.apps.filter( app => app.name === 'Ternary');
    this.thirdApp = hasThirdApp.length ? hasSeconday[0] : firebase.initializeApp(this.config2, 'Ternary');

    // initialize google map's autocomplete
    this.autocomplete  = new google.maps.places.Autocomplete(
      <HTMLInputElement>(document.getElementById('businessAddress')),
      {types: ['geocode']});

    // event listener
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  }
  onBusinessAddressChange(e) {
    const businessAddress = e.currentTarget.value;
    console.log('>>>>businessAddress', businessAddress);

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

  updateVendor(formData: NgForm) {
    const vendorId = this.route.snapshot.paramMap.get('id');
    if (formData.valid) {
      const formValues = formData.value;
      var timeListArray = []
      for (var i=0; i < this.timeSlotList.length; i++) {
        var time = {
          "label": this.vendor.timeSlots[i].label,
          "starttime": this.vendor.timeSlots[i].starttime === 'closed' ||  this.vendor.timeSlots[i].endtime === 'closed' ? 'closed' : this.vendor.timeSlots[i].starttime,
          "starttimezone": this.vendor.timeSlots[i].starttime === 'closed' ||  this.vendor.timeSlots[i].endtime === 'closed' ? '': this.vendor.timeSlots[i].starttimezone,
          "endtime": this.vendor.timeSlots[i].starttime === 'closed' ||  this.vendor.timeSlots[i].endtime === 'closed' ? '' : this.vendor.timeSlots[i].endtime,
          "endtimezone": this.vendor.timeSlots[i].starttime === 'closed' ||  this.vendor.timeSlots[i].endtime === 'closed' ? '': this.vendor.timeSlots[i].endtimezone,
        }
        timeListArray.push(time);
      }
      const req = {
        businessName: formValues.businessName,
        businessAddress: $('#businessAddress').val(),
        latitude: this.latitude,
        longitude: this.longitude,
        apt: $('#route').val(),
        city: $('#locality').val(),
        state: $('#administrative_area_level_1').val(),
        zipcode: $('#postal_code').val(),
        facebook: formData.value.facebook.toString().trim() != "" ? formData.value.facebook : "",
        twitter: formData.value.twitter.toString().trim() != "" ? formData.value.twitter : "",
        googlePlus: formData.value.googlePlus.toString().trim() != "" ? formData.value.googlePlus : "",
        website: formData.value.website,
        timeSlots: timeListArray,
      }

      this.secondaryApp.database().ref('/Role/' + vendorId).update(req)
      .then(() => {
        // formData.reset();
        if (this.userRole === '1') {
          this.updateRepresentativesTable(req);

          this.updateVendorsTable(req);
         // this.updateRepresentativesTable(req);
        } else if (this.userRole === '0') {
          console.log('Cuurent user is admin');
          this.updateRepresentativesTable(req);
          this.updateVendorsTable(req);
        } else {
          atoastr.showSuccess('Updated contact info');
        }
        // this.router.navigate(['/profile']);
      }).catch((err) => {
        atoastr.showError('Failed to update contact info');
        console.log('contactInfo update error: ' + err);
      })
    }
  }

  updateRepresentativesTable(req) {
    const vendorId = this.route.snapshot.paramMap.get('id');
    this.secondaryApp.database().ref('/Representatives/').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
      //  console.log(childSnapshot.val()) ;
      const boolval = childSnapshot.hasChild('vendors/' + vendorId);
      if (boolval === true ) {
        firebase.database().ref('/Representatives/' + childSnapshot.key + '/vendors/' + vendorId)
        .update(req)
        .then((resp) => {
         // atoastr.showSuccess('Updated info');
          // this.router.navigate(['/profile']);
        }).catch((err) => {
          atoastr.showError('Failed to update');
          console.log('ERROR (update representatives) : ', err);
        })
        // console.log('key: ' + childSnapshot.key)
        // console.log('This is true');
      }
       // childData will be the actual contents of the child
       // var childData = childSnapshot.val();
    });
    })

  //  this.secondaryApp.database().ref(`/Representatives/${this.route.snapshot.paramMap.get('id')}/vendors`).update(req)
  //    .then((resp) => {
  //      atoastr.showSuccess('Updated info');
  //      // this.router.navigate(['/profile']);
  //    }).catch((err) => {
  //      atoastr.showError('Failed to update');
  //      console.log('ERROR (update representatives) : ', err);
  //    })
 }

 updateVendorsTable(req) {

  this.secondaryApp.database().ref(`/Vendors/${this.route.snapshot.paramMap.get('id')}`).update(req)
    .then((resp) => {
      atoastr.showSuccess('Updated info');
      // this.router.navigate(['/profile']);
    }).catch((err) => {
      atoastr.showError('Failed to update');
      console.log('ERROR (update business/profilePic) : ', err);
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
