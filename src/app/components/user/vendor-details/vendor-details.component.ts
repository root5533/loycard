import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import 'rxjs/add/operator/take';
@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {
  vendor: any = {};
  userRole: String = '';
  isAdmin = false;
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
    if (this.userRole === '0') {
      this.isAdmin = true;
    }
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
     });
    }
  }

  ngOnInit() {
  }

}
