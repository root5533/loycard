import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { SalesrepService } from 'app/components/user/salesrep.service';
import { VendorService } from 'app/components/user/vendor.service';
import { jqxGridComponent } from 'jqwidgets-scripts'
import { Router } from '@angular/router';
import { id } from '@swimlane/ngx-datatable/release/utils';
declare var $: JQueryStatic;
declare let jsPDF;

@Component({
  selector: 'app-salesrep-list',
  templateUrl: './salesrep-list.component.html',
  styleUrls: ['./salesrep-list.component.scss']
})
export class SalesrepListComponent implements OnDestroy {
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('ordersGrid') ordersGrid: jqxGridComponent;
  salesreps: any;
  dataAdapter
  dataAdapter2
  vendors: any;
  selectedSalesRep: any;
  selectedVendor: any;
  total = 0;
  source: any =
    {
      localdata: null,
      datatype: 'array'
    }

  date = new Date();
  firstDay;
  lastDay;

  rowdetailstemplate: any = {
    rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>', rowdetailsheight: 220, rowdetailshidden: true
  };

  columns: any[] =
    [
      { text: 'Name', datafield: 'name', width: 200, cellbeginedit: this.cellbeginedit },
      { text: 'Email', datafield: 'email', width: 240, cellbeginedit: this.cellbeginedit },
      { text: 'Contact No', datafield: 'contactno', width: 150, cellbeginedit: this.cellbeginedit },
      { text: 'Sign Date', datafield: 'signdate', width: 150, cellbeginedit: this.cellbeginedit, cellsformat: 'yyyy-MM-dd' },
      { text: 'Country', datafield: 'country', width: 120, cellbeginedit: this.cellbeginedit },
      { text: 'Active', datafield: 'paid', width: 50, threestatecheckbox: true, columntype: 'checkbox' },
      { text: 'percentage', datafield: 'percentage', width: 80 },
      { text: 'Notes', datafield: 'notes', width: 240 },
    ];

  cellbeginedit() {
    return false
  }

  source2: any =
    {
      localdata: this.vendors,
      datatype: 'array'
    }

  columns2: any[] =
    [
      { text: 'Business Name', datafield: 'businessName', width: 300, cellbeginedit: this.cellbeginedit },
      { text: 'Email', datafield: 'email', width: 300, cellbeginedit: this.cellbeginedit },
      { text: 'State', datafield: 'state', width: 250, cellbeginedit: this.cellbeginedit },
      { text: 'City', datafield: 'city', width: 250, cellbeginedit: this.cellbeginedit },
      { text: 'Paid', datafield: 'paid', width: 80, threestatecheckbox: true, columntype: 'checkbox' },
    ];

  rendertoolbar = (toolbar: any): void => {
    if (toolbar[0]) {
      let container = document.createElement('div');
      container.style.margin = '5px';

      let buttonContainer1 = document.createElement('div');
      let buttonContainer2 = document.createElement('div');
      let buttonContainer3 = document.createElement('div');

      buttonContainer1.id = 'buttonContainer1';
      buttonContainer2.id = 'buttonContainer2';
      buttonContainer3.id = 'buttonContainer3';

      buttonContainer1.style.cssText = 'float: left';
      buttonContainer2.style.cssText = 'float: left; margin-left: 5px';
      buttonContainer3.style.cssText = 'float: left; margin-left: 5px';

      container.appendChild(buttonContainer1);
      container.appendChild(buttonContainer2);
      container.appendChild(buttonContainer3);
      toolbar[0].appendChild(container);
      let addRowButton = jqwidgets.createInstance('#buttonContainer1', 'jqxButton', { width: 105, value: 'Add Sales Rep.' });
      let deleteRowButton = jqwidgets.createInstance('#buttonContainer2', 'jqxButton', { width: 150, value: 'Delete Sales Rep.' });
      let reportRowButton = jqwidgets.createInstance('#buttonContainer3', 'jqxButton', { width: 150, value: 'Sales Rep. Report' });

      addRowButton.addEventHandler('click', () => {
        this.router.navigate(['/salesrep-add'], { queryParams: { source: 'salesrep-list' } })
      })

      deleteRowButton.addEventHandler('click', () => {
        let selectedrowindex = this.myGrid.getselectedrowindex();
        let rowscount = this.myGrid.getdatainformation().rowscount;
        // if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
          if (selectedrowindex >= 0) {
        if (confirm('Are you sure want to delete this selected Sales Rep?')) {
            this.salesrepService.removeSalesRep(this.selectedSalesRep).then((item) => {
              let id = this.myGrid.getrowid(selectedrowindex);
              this.myGrid.deleterow(id);
            });
          }
        } else {
          alert("please select row")
        }
      })

      reportRowButton.addEventHandler('click', () => {
        this.router.navigate(['/sales-rep-list-download']);
      })

    }
  };

  nestedGrids: any[] = new Array();

  private subscription: ISubscription;

  constructor(private afDB: AngularFireDatabase, private salesrepService: SalesrepService, private vendorService: VendorService, private _elRef: ElementRef, private router: Router) {

    this.firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

    this.subscription = this.salesrepService.getAll().snapshotChanges().subscribe(data => {
      this.salesreps = data.map((d) => ({ key: d.payload.key, ...d.payload.val() }));
      this.total = 0;
      this.salesreps.forEach((item) => {
        item['signdate'] = item['signdate'] ? item['signdate'] : '';
        item['country'] = item['country'] ? item['country'] : '';
        item['paid'] = item['paid'] ? item['paid'] : false;
        item['percentage'] = item['percentage'] ? item['percentage'] : '';
        // if (item['percentage'] && !isNaN(item['percentage'])) {
        //   this.totalPercentage += parseFloat((((item['percentage'] ? parseFloat(item['percentage']) : 0) * 49.99) / 100).toFixed(3));
        // }
        item['id'] = item['uid'];

        let vendors = item['vendors'] ? Object.keys(item['vendors']) : [];

        item["totalVendors"] = vendors.length;

        item["totalPaidVendors"] = vendors.filter((vendorId, val) => {
          // if (val % 5 == 0) {
          //   this.vendorService.getAllSalesRepSingleVendor(item.key, vendorId).update({ createdDate: new Date() })
          // }

          if (item['vendors'][vendorId] && item['vendors'][vendorId].paid) {
            return true;
          }
        }).length;

        item["newVendors"] = vendors.filter((vendorId) => {
          if (item['vendors'][vendorId] && item['vendors'][vendorId].createdDate) {
            let createdDate = new Date(item['vendors'][vendorId].createdDate);
            return this.firstDay <= createdDate && this.lastDay >= createdDate;
          }
        }).length;

        item["paidNewVendors"] = vendors.filter((vendorId) => {
          if (item['vendors'][vendorId] && item['vendors'][vendorId].createdDate && item['vendors'][vendorId].paid) {
            let createdDate = new Date(item['vendors'][vendorId].createdDate);
            return this.firstDay <= createdDate && this.lastDay >= createdDate;
          }
        }).length;

        item['newVendorAmount'] = (item["paidNewVendors"] * 30);

        item['percentageAmount'] = (!isNaN(parseFloat(item['percentage']))) ? ((parseFloat(item['percentage']) * (item["totalPaidVendors"]) * 49.99) / 100) : 0;

        //item['totalAmount'] = item['totalVendorAmount'] + item['percentageAmount'];

        this.total += (item['newVendorAmount'] + item['percentageAmount']);
      })
    });
  }

  public ngOnInit() {
    // setTimeout(() => {
    //   var salesrep = this.salesreps;
    //   let gridOptions = {
    //     data: this.salesreps,
    //     height: "auto",
    //     width: "100%",
    //     sorting: true,
    //     paging: false,
    //     autoload: true,
    //     editing: true,
    //     fields: [
    //       { name: "name", title: "Name", type: "text" , readOnly: true },
    //       { name: "email", title: "Email", type: "text", readOnly: true },
    //       { name: "contactno", title: "Contact No", type: "text", readOnly: true },
    //       {
    //         name: "uid", title: "Action", type: "text", readOnly: true, itemTemplate: function (value, item) {
    //           return '<a [routerLink]=["/sales-rep-edit",' + value +'>Edit</a>';
    //         }
    //       },
    //       { name: "date", title: "SIGN DATE", type: "text", readOnly: true },
    //       { name: "note", title: "NOTE", type: "textarea" },
    //       { name: "status", title: "STATUS", type: "text", readOnly: true},
    //       { name: "paid", title: "PAID", type: "checkbox" },
    //       { type: "control"}          
    //     ]
    //   };

    //   (<any>$(this._elRef.nativeElement))
    //     .find("#salesrep_list_grid")
    //     .jsGrid(gridOptions);
    // }, 4000);

    setTimeout(() => {
      this.source.localdata = this.salesreps;
      this.dataAdapter = new jqx.dataAdapter(this.source);
    }, 4000)
  }


  ready() {
  }

  cellBeginEditEvent(event: any) {
    let args = event.args;
  }

  cellEndEditEvent(event: any) {
    let { args: { row: { uid, key } }, args: { value, datafield } } = event;
    if (datafield == 'notes') {
      this.salesrepService.getById(key).update({ notes: value })
    }
    else if (datafield == 'paid') {
      this.salesrepService.getById(key).update({ paid: value })
    }
    else if (datafield == 'percentage') {
      this.salesrepService.getById(key).update({ percentage: value })
    }
  }

  cellBeginEditVendorEvent(event: any) {
    let args = event.args;
  }

  cellEndEditVendorEvent(event: any) {
    let { args: { row: { uid, key } }, args: { value } } = event;
    var objectSubscription = this.vendorService.getById(key).snapshotChanges().subscribe(vendor => {
      // check vendoe exist in firebase
      if (vendor.payload.val()) {
        let vendorData = vendor.payload.val();
        // check insertedBy is avalible or not
        this.vendorService.getById(key).update({ paid: value });
        if (objectSubscription) {
          objectSubscription.unsubscribe();
        }
        if (vendorData.insertedBy) {
          // take sales resp vendor
          var sub = this.vendorService.getAllSalesRepSingleVendor(vendorData.insertedBy, key).snapshotChanges().subscribe(data => {
            // vendor exists in insertedBy sales Rep
            let dataItem = data.payload.val()
            if (dataItem) {
              // update paid vendor from sales rep vendor list
              this.vendorService.getAllSalesRepSingleVendor(vendorData.insertedBy, key).update({ paid: value })
            }
            if (sub) {
              sub.unsubscribe();
            }
          });
        }
      }
    });
  }

  customersGridOnRowSelect(event) {
    let key = event.args.row.key;
    this.selectedSalesRep = key;
    this.subscription = this.vendorService.getAllSalesRepVendor(key).snapshotChanges().subscribe(data => {

      this.vendors = data.map((d) => ({ key: d.payload.key, ...d.payload.val() }));
      this.vendors.forEach((item) => {
        item['paid'] = item['paid'] ? item['paid'] : false;
      });

      this.source2.localdata = this.vendors;
      this.dataAdapter2 = new jqx.dataAdapter(this.source2, { autoBind: true });

      let dataSource = {
        datafield: this.source2.localdata,
        localdata: this.vendors
      }
      let adapter = new jqx.dataAdapter(dataSource);
      this.ordersGrid.source(adapter);
    });
  }

  customersGridVendorOnRowSelect(event) {
    let key = event.args.row.insertedBy;
    this.selectedVendor = key;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  rendertoolbarvendor = (toolbar: any): void => {
    if (toolbar[0]) {
      let container = document.createElement('div');
      container.style.margin = '5px';

      let buttonContainerPdf = document.createElement('div');

      buttonContainerPdf.id = 'buttonContainerPdf';

      buttonContainerPdf.style.cssText = 'float: left; margin-left: 5px';


      container.appendChild(buttonContainerPdf);

      toolbar[0].appendChild(container);

      let pdfButton = jqwidgets.createInstance('#buttonContainerPdf', 'jqxButton', { width: 105, value: 'Vendor Report' });

      // printButton.addEventHandler('click', () => {
      //   let gridContent = this.ordersGrid.exportdata('html');
      //   let newWindow = window.open('', '', 'width=800, height=500'),
      //     document = newWindow.document.open(),
      //     pageContent =
      //       '<!DOCTYPE html>\n' +
      //       '<html>\n' +
      //       '<head>\n' +
      //       '<meta charset="utf-8" />\n' +
      //       '<title>Deal by Vendor</title>\n' +
      //       '</head>\n' +
      //       '<body>\n' + gridContent + '\n</body>\n</html>';
      //   document.write(pageContent);
      //   document.close();
      // })

      pdfButton.addEventHandler('click', () => {
        if (this.selectedSalesRep) {
          this.router.navigate(['/sales-rep-vendor-list-download', this.selectedSalesRep]);
        }
      })

    }
  }
}
