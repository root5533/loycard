import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { SalesrepService } from '../salesrep.service';
import { ISubscription } from 'rxjs/Subscription';
import { VendorService } from '../vendor.service';
import { Router } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
declare let moment;
declare let jsPDF;
declare let html2pdf;
import { IMyDpOptions, IMyDateModel } from 'mydatepicker'
import { NumberFormatStyle } from '@angular/common';

@Component({
  selector: 'app-salesrep-list-download',
  templateUrl: './salesrep-list-download.component.html',
  styleUrls: ['./salesrep-list-download.component.scss']
})
export class SalesrepListDownloadComponent implements OnInit {

  model: any;
  private subscription: ISubscription;
  totalPercentage = 0;
  salesreps = [];
  date = new Date();
  firstDay;
  lastDay;



  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };


  totalRecord = {
    totalVendors: 0,
    newVendors: 0,
    paidNewVendors: 0,
    newVendorAmount: 0,
    percentageAmount: 0,
    total: 0,
    totalPaidVendors: 0
  }
  forbiddenDates: Date[] = [];
  selectedType = 'Weekly';
  divideValue = 4;

  constructor(private afDB: AngularFireDatabase, private salesrepService: SalesrepService, private vendorService: VendorService, private _elRef: ElementRef, private router: Router) {
    // let date = new Date();
    // let start = new Date(date.getFullYear(), date.getMonth(), 1)
    // let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.model = {
      "number": "3421"
    }
    this.subscription = this.salesrepService.getAll().snapshotChanges().subscribe(data => {
      this.salesreps = data.map((d) => ({ key: d.payload.key, ...d.payload.val() }));
      console.log("data",this.salesreps)
      this.dateFilter(this.selectedType);
    });
  }

  ngOnInit() {
  }


  downloadPdf() {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.internal.scaleFactor = 1.90;
    let options = {
      pagesplit: true,
      background: '#fff',
    };

    pdf.addHTML(document.getElementById("download-form"), options, () => {
      pdf.save("salesRep_list.pdf");
    });
  }

  printPdf() {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.internal.scaleFactor = 1.90;
    let options = {
      pagesplit: true,
      background: '#fff',
    };
    pdf.addHTML(document.getElementById("download-form"), options, () => {
      pdf.autoPrint();
      let blob = pdf.output('blob');
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'Sales Rep Report.pdf');
      } else {
        window.open(URL.createObjectURL(blob), '_blank');
      }
    });
  }


  dateFilter(type) {
    this.selectedType = type;
    if (this.selectedType == 'Weekly') {
      this.divideValue = 4;
      let curr = new Date; // get current date
      let first = curr.getDate() - (curr.getDay() ? (curr.getDay() - 1) : 6); // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6

      let firstday = new Date(curr.setDate(first))
      let lastday = new Date(curr.setDate(last));

      this.model.startDate = moment(firstday).format('MM.DD.YYYY');
      this.model.endDate = moment(lastday).format('MM.DD.YYYY');

      this.model.start = firstday;
      this.model.end = lastday;

    } else if (this.selectedType == 'Biweekly') {
      let date = new Date();
      let day = date.getDate();
      if (day <= 15) {
        this.model.startDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MM.DD.YYYY');
        this.model.endDate = moment(new Date(date.getFullYear(), date.getMonth(), 15)).format('MM.DD.YYYY');

        this.model.start = new Date(date.getFullYear(), date.getMonth(), 1);
        this.model.end = new Date(date.getFullYear(), date.getMonth(), 15);
      } else {
        this.model.startDate = moment(new Date(date.getFullYear(), date.getMonth(), 16)).format('MM.DD.YYYY');
        this.model.endDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('MM.DD.YYYY');

        this.model.start = new Date(date.getFullYear(), date.getMonth(), 16);
        this.model.end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
      this.divideValue = 2;
    } else if (this.selectedType == 'Monthly') {
      this.divideValue = 1;
      let date = new Date();
      this.model.startDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MM.DD.YYYY');
      this.model.endDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format('MM.DD.YYYY');

      this.model.start = new Date(date.getFullYear(), date.getMonth(), 1);
      this.model.end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    let date = new Date();
    let start = new Date(date.getFullYear(), date.getMonth(), 1)
    let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let dateRanges = [{ startDate: start, endDate: end }];
    let ranges = [{ startDate: this.model.start, endDate: this.model.end }];
    this.onFilter(dateRanges, ranges);
  }
  //dateFilter(type) {

  // if (this.model.startDate != "" && this.model.endDate != "") {
  //   let start;
  //   if (this.model.startDate.formatted) {
  //     start = this.model.startDate.formatted;
  //   } else if (this.model.startDate.date) {
  //     start = moment(new Date(this.model.startDate.date.year, this.model.startDate.date.month - 1, this.model.startDate.date.day)).format('YYYY-MM-DD');
  //   }
  //   let end;
  //   if (this.model.endDate.formatted) {
  //     end = this.model.endDate.formatted;
  //   } else if (this.model.endDate.date) {
  //     end = moment(new Date(this.model.endDate.date.year, this.model.endDate.date.month - 1, this.model.endDate.date.day)).format('YYYY-MM-DD');
  //   }
  //   this.firstDay = start;
  //   this.lastDay = end;
  //   var dateRanges = this.dateRange(start, end);
  //   this.onFilter(dateRanges);
  // }
  //}

  dateRange(startDate, endDate) {

    // var start = startDate.split('-');
    // var end = endDate.split('-');
    // var startYear = parseInt(start[0]);
    // var endYear = parseInt(end[0]);
    // var dates = [];
    // var startD = new Date(startDate);
    // var endD = new Date(endDate);

    // for (var i = startYear; i <= endYear; i++) {
    //   var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
    //   var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
    //   for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
    //     var month = j + 1;
    //     var displayMonth = month < 10 ? '0' + month : month;
    //     //dates.push([i, displayMonth, '01'].join('-'));
    //     // console.log([i, displayMonth, '01'].join('-'))
    //     let obj = Object.create({});
    //     if (new Date(i, (parseInt(displayMonth.toString()) - 1), 1) < startD) {
    //       obj.startDate = startD;
    //     } else {
    //       obj.startDate = new Date(i, (parseInt(displayMonth.toString()) - 1), 1);
    //     }

    //     if (new Date(i, (parseInt(displayMonth.toString())), 0) >= endD) {
    //       obj.endDate = endD;
    //     } else {
    //       obj.endDate = new Date(i, (parseInt(displayMonth.toString())), 0);
    //     }
    //     dates.push(obj);
    //   }
    // }
    // return dates;
  }

  onFilter(dateRanges, ranges) {

    this.totalRecord = {
      totalVendors: 0,
      newVendors: 0,
      paidNewVendors: 0,
      newVendorAmount: 0,
      percentageAmount: 0,
      total: 0,
      totalPaidVendors: 0
    }
    this.totalPercentage = 0;
    this.salesreps.forEach((item) => {
   //   console.log("this.salesreps",this.salesreps)
      let vendors = item['vendors'] ? Object.keys(item['vendors']) : [];

      item["totalVendors"] = vendors.length;

      item["totalPaidVendors"] = vendors.filter((vendorId, val) => {
        if (item['vendors'][vendorId] && item['vendors'][vendorId].paid) {
          return true;
        }
      }).length;

      item["paidNewVendors"] = vendors.filter((vendorId) => {
        return ranges.filter((range) => {
          if (item['vendors'][vendorId] && range.startDate <= new Date(item['vendors'][vendorId].createdDate) &&
            range.endDate >= new Date(item['vendors'][vendorId].createdDate)) {
            return true;
          }
        }).length ? true : false;
      }).length;

      item["newVendors"] = vendors.filter((vendorId) => {
        return ranges.filter((range) => {
          if (item['vendors'][vendorId] && range.startDate <= new Date(item['vendors'][vendorId].createdDate) &&
            range.endDate >= new Date(item['vendors'][vendorId].createdDate) && item['vendors'][vendorId].paid) {
            return true;
          }
        }).length ? true : false;
      }).length;

      let count = 0;

      vendors.forEach((vendorId) => {
        var flag = false;
        dateRanges.forEach((range) => {
          if (item['vendors'][vendorId] && range.startDate <= new Date(item['vendors'][vendorId].createdDate) &&
            range.endDate >= new Date(item['vendors'][vendorId].createdDate)) {
            flag = true;
            count += 1
          } else if (flag) {
            count += 1
          } else if (range.startDate >= new Date(item['vendors'][vendorId].createdDate)) {
            count += 1
          }
        })
      });

      item['newVendorAmount'] = (item["paidNewVendors"] * 30);


      item['percentageAmount'] = ((!isNaN(parseFloat(item['percentage']))) ? ((parseFloat(item['percentage']) * (count) * 49.99) / 100) : 0) / this.divideValue;

      this.totalRecord.totalVendors += item["totalVendors"];
      this.totalRecord.totalPaidVendors += item["totalPaidVendors"];
      this.totalRecord.newVendors += item["newVendors"];
      this.totalRecord.paidNewVendors += item["paidNewVendors"];
      this.totalRecord.newVendorAmount += item['newVendorAmount'];

      this.totalRecord.percentageAmount += item['percentageAmount'];
      this.totalRecord.total += (item['newVendorAmount'] + item['percentageAmount']);
    })
  }



}
