import { Component, OnInit } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { VendorService } from '../vendor.service';
import { SalesrepService } from '../salesrep.service';
import { Router, ActivatedRoute } from "@angular/router";
import { count } from 'rxjs/operator/count';
import { IMyDpOptions } from 'mydatepicker';

declare let moment;
declare let jsPDF;
declare let html2pdf;

@Component({
  selector: 'app-salesrep-vendor-list-download',
  templateUrl: './salesrep-vendor-list-download.component.html',
  styleUrls: ['./salesrep-vendor-list-download.component.scss']
})
export class SalesrepVendorListDownloadComponent implements OnInit {

  vendors = [];
  vendorList = [];
  salesRep;
  selectedSalesRep: any;
  totalPercentage = 0;
  firstDay;
  lastDay;
  date = new Date();

  model;

  totalRecord = {
    totalActiveVendors: 0,
    total: 0
  }

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };

  selectedType = 'Weekly';
  divideValue = 4;


  private subscription: ISubscription;

  constructor(private vendorService: VendorService, private route: ActivatedRoute, private salesrepService: SalesrepService) {
    let date = new Date();
    let start = new Date(date.getFullYear(), date.getMonth(), 1)
    let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.model = {
      "loycardherf": "loycard.co",
      "title": "Sale Representative",
      "project": "loycard.co",
      "startDate": '',
      'endDate': ''
    }

    this.route.params.subscribe(params => {
      this.selectedSalesRep = params['id'];
      this.subscription = this.salesrepService.getById(this.selectedSalesRep).snapshotChanges().subscribe(data => {
        if (data.payload.val()) {
          this.salesRep = data.payload.val()
          this.dateFilter(this.selectedType);
        }
      })
    })
  }

  ngOnInit() {
  }

  changePdf() {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.internal.scaleFactor = 1.90;
    let options = {
      pagesplit: true,
      background: '#fff',
    };

    pdf.addHTML(document.getElementById("element-to-print"), options, () => {
      pdf.save("vendor_list.pdf");
    });
  }

  printPdf() {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.internal.scaleFactor = 1.90;
    let options = {
      pagesplit: true,
      background: '#fff',
    };
    pdf.addHTML(document.getElementById("element-to-print"), options, () => {
      pdf.autoPrint();
      let blob = pdf.output('blob');
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'Sales Rep  Vendor Report.pdf');
      } else {
        window.open(URL.createObjectURL(blob), '_blank');
      }
    });
  }

  // dateFilter() {
  //   if (this.model.startDate != "" && this.model.endDate != "") {
  //     let start;
  //     if (this.model.startDate.formatted) {
  //       start = this.model.startDate.formatted;
  //     } else if (this.model.startDate.date) {
  //       start = moment(new Date(this.model.startDate.date.year, this.model.startDate.date.month - 1, this.model.startDate.date.day)).format('YYYY-MM-DD');
  //     }
  //     let end;
  //     if (this.model.endDate.formatted) {
  //       end = this.model.endDate.formatted;
  //     } else if (this.model.endDate.date) {
  //       end = moment(new Date(this.model.endDate.date.year, this.model.endDate.date.month - 1, this.model.endDate.date.day)).format('YYYY-MM-DD');
  //     }
  //     this.firstDay = start;
  //     this.lastDay = end;
  //     var dateRanges = this.dateRange(start, end);
  //     this.onFilter(dateRanges);
  //   }
  // }

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
  // dateRange(startDate, endDate) {
  //   var start = startDate.split('-');
  //   var end = endDate.split('-');
  //   var startYear = parseInt(start[0]);
  //   var endYear = parseInt(end[0]);
  //   var dates = [];
  //   var startD = new Date(startDate);
  //   var endD = new Date(endDate);

  //   for (var i = startYear; i <= endYear; i++) {
  //     var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
  //     var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
  //     for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
  //       var month = j + 1;
  //       var displayMonth = month < 10 ? '0' + month : month;
  //       //dates.push([i, displayMonth, '01'].join('-'));
  //       // console.log([i, displayMonth, '01'].join('-'))
  //       let obj = Object.create({});
  //       if (new Date(i, (parseInt(displayMonth.toString()) - 1), 1) < startD) {
  //         obj.startDate = startD;
  //       } else {
  //         obj.startDate = new Date(i, (parseInt(displayMonth.toString()) - 1), 1);
  //       }

  //       if (new Date(i, (parseInt(displayMonth.toString())), 0) >= endD) {
  //         obj.endDate = endD;
  //       } else {
  //         obj.endDate = new Date(i, (parseInt(displayMonth.toString())), 0);
  //       }
  //       dates.push(obj);
  //     }
  //   }
  //   return dates;
  // }

  onFilter(dateRanges, ranges) {
    this.vendorList = [];
    this.vendors = this.salesRep['vendors'] ? Object.keys(this.salesRep['vendors']) : [];
    this.totalRecord.totalActiveVendors = 0;
    this.totalRecord.total = 0;
    this.totalPercentage = 0;
    let activeVendorList = [];

    this.vendors.forEach((vendorId) => {
      let obj;
      obj = {
        businessName: this.salesRep['vendors'][vendorId].businessName,
        newVendorAmount: 0,
        percentageAmount: 0
      };
      obj.isNewVendor = false;

      if (this.salesRep['vendors'][vendorId] && this.salesRep['vendors'][vendorId].createdDate) {
        obj.isNewVendor = ranges.filter((range) => {
          if (range.startDate <= new Date(this.salesRep['vendors'][vendorId].createdDate) &&
            range.endDate >= new Date(this.salesRep['vendors'][vendorId].createdDate)) {
            return true;
          }
        }).length ? true : false;
      }

      if (obj.isNewVendor && this.salesRep['vendors'][vendorId].paid) {
        obj.newVendorAmount = 30;
      }

      var count = 0;
      if (this.salesRep['vendors'][vendorId].paid && (!isNaN(parseFloat(this.salesRep['percentage'])))) {
        var flag = false;
        dateRanges.forEach((range) => {
          if (range.startDate <= new Date(this.salesRep['vendors'][vendorId].createdDate) &&
            range.endDate >= new Date(this.salesRep['vendors'][vendorId].createdDate)) {
            flag = true;
            count += 1
          } else if (flag) {
            count += 1
          } else if (range.startDate >= new Date(this.salesRep['vendors'][vendorId].createdDate)) {
            count += 1
          }
        })
        obj.percentageAmount = ((parseFloat(this.salesRep['percentage']) * (count) * 49.99) / 100) / this.divideValue;
      }
      if (this.salesRep['vendors'][vendorId].paid == true) {
        this.totalRecord.totalActiveVendors += 1
      }

      this.totalRecord.total += obj.newVendorAmount + obj.percentageAmount;

      activeVendorList.push(obj)
    })
    this.vendorList = activeVendorList;

  }
}

