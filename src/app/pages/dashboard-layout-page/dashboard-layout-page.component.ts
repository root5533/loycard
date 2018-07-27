import {
  Component, OnInit, Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

import { VendorService } from 'app/components/user/vendor.service';
import { SalesrepService } from 'app/components/user/salesrep.service';
import { VendorAddComponent } from 'app/components/user/vendor-add/vendor-add.component';

import { WeatherService } from '../../weather.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-layout-page',
  templateUrl: './dashboard-layout-page.component.html',
  styleUrls: ['./dashboard-layout-page.component.scss']
})

export class DashboardLayoutPageComponent implements OnInit {
  vendors: any;
  isVendor = false;
  isAdmin = false;
  totalVendors;
  activeVendors = 0;
  newVendors = 0;
  totalSalesRepresentatives = 0;
  userId;
  activedeals: any;

  //customer specific variables
  totalCustomerPurchaseCount = 0;
  totalCustomerRewardsIssued = 0;
  totalCustomerRewardsClaimed = 0;
  totalAdminCustomers = 0;

  //vendor specific variables
  totalVendorPurchaseCount = 0;
  totalVendorRewardsIssued = 0;
  totalVendorRewardsClaimed = 0;
  totalVendorCustomers = 0;

  constructor(
    private afdb: AngularFireDatabase,
    private vendorService: VendorService,
    private salesrepService: SalesrepService,
    private element: ElementRef,
    private _weather: WeatherService
  ) {
    this.newVendors = localStorage.getItem("addVendorCounter") == null ? 0 : parseInt(localStorage.getItem("addVendorCounter"));
    this.userId = localStorage.getItem('userId');

    if (localStorage.getItem('userrole') === '2') {
      this.isVendor = true;

      this.vendorService
        .getCustomers()
        .snapshotChanges()
        .subscribe(customerkeys$ => {
          customerkeys$.map(customerkeys => {
            const customerId = customerkeys.key;
            this.afdb
              .object(`/Role/${customerId}`)
              .valueChanges()
              .subscribe(cus => {
                this.afdb
                  .list("/LoyaltyCards")
                  .valueChanges()
                  .subscribe(response => {
                    response.map(loyaltyObj => {
                      if (loyaltyObj["vendorID"] == this.userId) {
                        if (loyaltyObj["customerID"] == customerId) {
                          this.totalVendorPurchaseCount += parseInt(loyaltyObj["purchaseCount"]);// used in pie chart 1 
                          this.totalVendorRewardsClaimed += parseInt(loyaltyObj["rewardsClaimed"]);// used in pie chart 1 
                          this.totalVendorRewardsIssued += parseInt(loyaltyObj["rewardsIssued"]);
                        }
                      }
                    });
                  });
              });
          });
        });
    }
    if (localStorage.getItem('userrole') === '0') {
      this.isAdmin = true;
    }

    this.vendorService.getAll().valueChanges().subscribe(data => {
      if (localStorage.getItem("date") != null) {
        this.totalVendors = data.length - this.newVendors;
        
      } else {
        this.totalVendors = data.length;
      }

      this.vendors = data;
      const vendors = this.vendors;
      for (let i = 0; i < vendors.length; i++) {
        if (vendors[i].uid) {
          const vendorId = vendors[i].uid;
          afdb.object(`VendorUsers/${vendorId}/membership/status`)
            .valueChanges()
            .subscribe(item => {
              if (item == "active") {
                this.activeVendors++;
              }
            });
        }
      }
    });

    this.salesrepService.getAll().valueChanges().subscribe(data => {
      this.totalSalesRepresentatives = data.length;
      // console.log(data);
    });

    this.afdb.object('/Subscriptions/' + this.userId).valueChanges()
      .subscribe((resp) => {
        if(resp) {
        this.totalVendorCustomers = Object.keys(resp).length;
        }
      });

    this.afdb.list('/Subscriptions/', ref => ref.orderByChild('key')).valueChanges()
      .subscribe((resp2) => {
        var customerLen = 0;
        resp2.map(
          function (currVal) {
            customerLen += Object.keys(currVal).length;
          }
        );
        this.totalAdminCustomers = customerLen;
        // alert("kkk:"+this.totalAdminCustomers);
      });

    this.afdb.list('/LoyaltyOffers/', ref => ref.orderByChild('vendorID').equalTo(this.userId))
      .valueChanges()
      .subscribe((resp2) => {
        if (localStorage.getItem("date") != null) {
          var timeDiff = Math.abs(new Date().getTime() - JSON.parse(localStorage.getItem("date")));
          var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
          if (diffDays >= 1) {
            this.newVendors = Object.keys(resp2).length;
          }
        } else {
          this.newVendors = Object.keys(resp2).length;
        }
      });

    this.afdb.list('/LoyaltyRewards/', ref => ref.orderByChild('vendorID').equalTo(this.userId))
      .valueChanges()
      .subscribe((resp3) => {
        //this.totalredeemdeals = Object.keys(resp3).length;
      });

    this.afdb.list('/LoyaltyOffers/')
      .valueChanges()
      .subscribe((resp3) => {
        this.activedeals = Object.keys(resp3).length;
      });

    this.afdb.list('/LoyaltyCards/')
      .valueChanges()
      .subscribe((resp3) => {
        for (var redeemDealCounter = 0; redeemDealCounter < resp3.length; redeemDealCounter++) {
          this.totalCustomerRewardsClaimed += parseInt(resp3[redeemDealCounter]["rewardsClaimed"]);
          this.totalCustomerRewardsIssued += parseInt(resp3[redeemDealCounter]["rewardsIssued"]);
          this.totalCustomerPurchaseCount += parseInt(resp3[redeemDealCounter]["purchaseCount"]);
        }
        //this.totalredeemdeals = Object.keys(resp3).length;
      });
  }

  ngOnInit() {
    setTimeout(() => {
      //Get the context of the Chart canvas element we want to select
      var ctxPie1 = $("#pie-chart-1");
      var ctxPie2 = $("#pie-chart-2");

      // Chart Options
      var chartOptionsPie = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
      };

      //Vendor Chart Data
      var vendorChartDataPie1 = {
        labels: ["Purchase Count", "Reward Claimed"],
        datasets: [{
          label: "Vendor Graph",
          data: [this.totalVendorPurchaseCount, this.totalVendorRewardsClaimed],
          backgroundColor: ['#6496bc', '#d9e3e1']
        }]
      };

      var vendorChartDataPie2 = {
        labels: ["Rewards Issued", "Total Customer"],
        datasets: [{
          label: "Vendor Graph",
          data: [this.totalVendorRewardsIssued, this.totalVendorCustomers],
          backgroundColor: ['#e4d0d2', '#9aafad']
        }]
      };

      //Admin Chart Data      
      var adminChartDataPie1 = {
        labels: ["Purchase Count", "Reward Claimed"],
        datasets: [{
          label: "Admin Graph",
          data: [this.totalCustomerPurchaseCount, this.totalCustomerRewardsIssued],
          backgroundColor: ['#6496bc', '#d9e3e1']
        }]
      };
// alert(this.totalAdminCustomers)
      var adminChartDataPie2 = {
        labels: ["Rewards Issued", "Total Customer"],
        datasets: [{
          label: "Admin Graph",
          data: [this.totalCustomerRewardsIssued, this.totalAdminCustomers],
          backgroundColor: ['#e4d0d2', '#9aafad']
        }]
      };

      //Vendor Chart Config 
      var vendorConfigPie1 = {
        type: 'pie',
        options: chartOptionsPie,
        data: vendorChartDataPie1
      };

      var vendorConfigPie2 = {
        type: 'pie',
        options: chartOptionsPie,
        data: vendorChartDataPie2
      };

      //Admin Chart Config
      var adminConfigPie1 = {
        type: 'pie',
        options: chartOptionsPie,
        data: adminChartDataPie1
      };

      var adminConfigPie2 = {
        type: 'pie',
        options: chartOptionsPie,
        data: adminChartDataPie2
      };

      // Create the chart
      var pieChart;
      if (this.isAdmin) {
        pieChart = new Chart(ctxPie1, adminConfigPie1);
        pieChart = new Chart(ctxPie2, adminConfigPie2);
      } else if (this.isVendor) {
        pieChart = new Chart(ctxPie1, vendorConfigPie1);
        pieChart = new Chart(ctxPie2, vendorConfigPie2);
      }
    }, 4000);
  }

  onSelect(event) {
    console.log(event);
  }

}
