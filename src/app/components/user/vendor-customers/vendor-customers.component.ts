import { Component, ViewChild, ElementRef } from "@angular/core";
import { VendorService } from "../vendor.service";
import { AngularFireDatabase } from "angularfire2/database";

declare var $: JQueryStatic;

@Component({
  selector: "app-vendor-customers",
  templateUrl: "./vendor-customers.component.html",
  styleUrls: ["./vendor-customers.component.scss"]
})
export class VendorCustomersComponent {
  customers = [];
  loyalty = [];
  userId;
  updateCustomer = [];
  rows = [];
  temp = [];

  constructor(
    private vendorService: VendorService,
    private afdb: AngularFireDatabase,
    private _elRef: ElementRef
  ) {

    this.userId = localStorage.getItem("userId");
    this.vendorService
      .getCustomers()
      .snapshotChanges()
      .subscribe(customerkeys$ => {
        this.updateCustomer = [];
        customerkeys$.map(customerkeys => {
          const customerId = customerkeys.key;
          this.afdb
            .object(`/Role/${customerId}`)
            .valueChanges()
            .subscribe(cus => {
              this.customers.push(cus);
              this.afdb
                .list("/LoyaltyCards")
                .valueChanges()
                .subscribe(response => {
                  response.map(loyaltyObj => {
                    if (loyaltyObj["vendorID"] == this.userId) {
                      if (loyaltyObj["customerID"] == customerId) {
                        var customerObj = {
                          purchaseCount: loyaltyObj["purchaseCount"],
                          purchasesPerReward: loyaltyObj["purchasesPerReward"],
                          rewardsClaimed: loyaltyObj["rewardsClaimed"],
                          rewardsIssued: loyaltyObj["rewardsIssued"],
                          // created:
                          //   cus["created"] !== undefined ? this.formatDate(cus["created"]) : "",
                          email: cus["email"],
                          name: cus["name"],
                          role: cus["role"],
                          signedIn:
                            cus["signedIn"] !== undefined ? this.formatDate(cus["signedIn"]) : ""
                        };
                        this.updateCustomer.push(customerObj);
                      }
                    }
                  });
                });
            });
        });
      });
  }

  public formatDate(date){
    var dateStr = date.split('/');
    var mm = dateStr[1]; 
    var dd = dateStr[2]; 
    var yyyy = dateStr[0];
    
    return mm + '/' + dd + '/' + yyyy;
  }

  public ngOnInit() {
    setTimeout(() => {
      let options = {
        data: this.updateCustomer,
        columns: [
          { data: "name" },
          { data: "email" },
          { data: "rewardsIssued" },
          { data: "purchaseCount" },
          { data: "signedIn" },
          // { data: "created" }
        ]
      };

      (<any>$(this._elRef.nativeElement))
        .find("#customers_table")
        .DataTable(options);
    }, 4000);
  }
}