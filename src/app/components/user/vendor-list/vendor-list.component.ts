import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Component, Pipe, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { VendorService } from 'app/components/user/vendor.service';
//import { jqxGridComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid'
import { jqxGridComponent } from 'jqwidgets-scripts'


@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})

export class VendorListComponent implements OnDestroy {
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('beginEdit') beginEdit: ElementRef;
  @ViewChild('endEdit') endEdit: ElementRef;
  vendors: any;
  activeVendors: any;
  data;
  dataAdapter
  vendorSelectedRow: any;
  source: any =
    {
      localdata: null,
      datatype: 'array'
    }
  rowdetailstemplate =
    {
      rowdetails: '<div style="margin: 10px;"><ul style="margin-left: 30px;"><li class="title"></li><li>Notes</li><li>Last Location</li></ul><div class="information"></div><div class="notes"></div> <div id="basic-map"></div></div>',
      rowdetailsheight: 200
    };

  linkrenderer = (row: number, column: any, value: any): any => {
    let status;
    let statusHtml;
    if (value == "paid") {
      status = "ACTIVE";
      statusHtml = '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;color:green">' + status + '</div>'
    } else if (value == "free") {
      status = "FREE";
      statusHtml = '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;color:red">' + status + '</div>'
    } else {
      status = "INACTIVE";
      statusHtml = '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;color:blue">' + status + '</div>'
    }
    return statusHtml;
  }

  columns: any[] =
    [
      { text: '#', datafield: "number", width: 50, cellbeginedit: this.cellbeginedit },
      { text: 'Business Name', datafield: 'businessName', width: 300, cellbeginedit: this.cellbeginedit },
      { text: 'Email', datafield: 'email', width: 300, cellbeginedit: this.cellbeginedit },
      { text: 'State', datafield: 'state', width: 70, cellbeginedit: this.cellbeginedit },
      { text: 'City', datafield: 'city', width: 100, cellbeginedit: this.cellbeginedit },
      { text: 'Status', datafield: 'status', width: 100, cellsrenderer: this.linkrenderer, cellbeginedit: this.cellbeginedit },
      { text: 'Notes', datafield: 'notes', width: 230 },
    ];



  cellbeginedit() {
    return false
  }

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
      let addRowButton = jqwidgets.createInstance('#buttonContainer1', 'jqxButton', { width: 105, value: 'Add Vendor' });
      let deleteRowButton = jqwidgets.createInstance('#buttonContainer2', 'jqxButton', { width: 150, value: 'Delete Vendor' });
      let editRowButton = jqwidgets.createInstance('#buttonContainer3', 'jqxButton', { width: 150, value: 'Edit Vendor' });

      addRowButton.addEventHandler('click', () => {
        this.router.navigate(['vendor-add'], { queryParams: { source: 'vendor-list' } })
      })

      deleteRowButton.addEventHandler('click', () => {
        let selectedrowindex = this.myGrid.getselectedrowindex();
        let rowscount = this.myGrid.getdatainformation().rowscount;
        // if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
        if (selectedrowindex >= 0) {

          if (confirm('Are you sure want to delete this selected Vendor ?')) {

            let key = this.vendorSelectedRow;
            // take vendor from key 
          
            this.vendorService.getById(key).snapshotChanges().subscribe(vendor => {
              // check vendoe exist in firebase
              if (vendor.payload.val()) {
                let vendorData = vendor.payload.val();
                // check insertedBy is avalible or not
                if (vendorData.insertedBy) {
                  // take sales resp vendor
                  this.vendorService.getAllSalesRepSingleVendor(vendorData.insertedBy, key).snapshotChanges().subscribe(data => {
                    // vendor exists in insertedBy sales Rep
                    if (data.payload.val()) {
                      // remove vendor from sales rep vendor list
                      this.vendorService.removeSalesRepVendor(vendorData.insertedBy, key).then((item) => {
                      })
                    }
                  });
                }

                // remove vendor from main vendor list
                this.vendorService.removeVendor(this.vendorSelectedRow).then((vendor) => {
                  let id = this.myGrid.getrowid(selectedrowindex);
                  this.myGrid.deleterow(id);
                });
              }
            });
          }
        } else {
          alert("please select row")
        }
      })

      editRowButton.addEventHandler('click', () => {
        let selectedrowindex = this.myGrid.getselectedrowindex();
        let rowscount = this.myGrid.getdatainformation().rowscount;
        // if (selectedrowindex >= 0 && selectedrowindex < parseFloat(rowscount)) {
          if (selectedrowindex >= 0) {

            let key = this.vendorSelectedRow;
            // take vendor from key 
            this.router.navigate(['vendor-edit', key]);
        } else {
          alert("please select row")
        }
      })
    }
  };

  private subscription: ISubscription;

  constructor(private afDB: AngularFireDatabase, private vendorService: VendorService, private _elRef: ElementRef, private router: Router) {
    this.subscription = this.vendorService.getAll().snapshotChanges().subscribe(data => {
      this.vendors = data.map((d) => ({ key: d.payload.key, ...d.payload.val() }));
      this.activeVendors = 0;
      let count = 1;
      let vendorLength = this.vendors.length;

      this.vendors.forEach((vendor, key) => {
        vendor['businessName'] = vendor['businessName'] ? vendor['businessName'] : '';
        vendor['email'] = vendor['email'] ? vendor['email'] : '';
        vendor['state'] = vendor['state'] ? vendor['state'] : '';
        vendor['city'] = vendor['city'] ? vendor['city'] : '';
        vendor['status'] = vendor['status'] ? vendor['status'] : '';
        vendor['notes'] = vendor['notes'] ? vendor['notes'] : '';

        // if (vendor.uid) {
        //   const vendorId = vendor.key;

        //   vendor["number"] = this.vendors.length - key;
        //   afDB.object(`VendorUsers/${vendorId}/membership/status`)
        //     .valueChanges()
        //     .subscribe(item => {

        //       if (vendor && vendor.status) {
        //         vendor.status = item;
        //         if (item == "active") {
        //           this.activeVendors++;
        //         }
        //       }
        //     });
        // }
      });
    });
  }

  public ngOnInit() {

    setTimeout(() => {
      this.source.localdata = this.vendors;
      this.dataAdapter = new jqx.dataAdapter(this.source);
    }, 4000)
  }

  initrowdetails(index: any, parentElement: any, gridElement: any, datarecord: any) {
    if (parentElement) {
      let tabsdiv = parentElement.children[0];
      let information = tabsdiv.children[1];
      let notes = tabsdiv.children[2];
      let locations = tabsdiv.children[3];
      let title = tabsdiv.children[0].children[0];

      if (tabsdiv != null) {
        title.innerHTML = datarecord.businessName;

        let container = document.createElement('div');
        container.style.margin = '5px';
        information.appendChild(container);

        let photocolumn = document.createElement('div');
        let leftcolumn = document.createElement('div');
        let rightcolumn = document.createElement('div');

        photocolumn.style.cssText = 'float: left; width: 15%';
        leftcolumn.style.cssText = 'float: left; width: 45%';
        rightcolumn.style.cssText = 'float: left; width: 40%';

        container.appendChild(photocolumn);
        container.appendChild(leftcolumn);
        container.appendChild(rightcolumn);

        let image = document.createElement('div');
        image.style.marginTop = '10px';

        let photo = document.createElement('div');
        photo.style.margin = '10px';
        photo.className = 'jqx-rc-all';
        //photo.innerHTML = '<b>Photo:</b>';

        let img = document.createElement('img');
        img.style.height = 'auto';
        img.style.width = '100%';
        img.style.marginLeft = '10px';

        img.src = "assets/app/images/logo/stack-logo-small.png";
        if (datarecord.profilePic != null || datarecord.profilePic != "" || datarecord.profilePic != undefined) {
          img.src = datarecord.profilePic;
        }
        if (datarecord.profilePic == undefined) {
          img.src = "assets/app/images/logo/no-Image-Icon.jpg";
        }

        //'https://firebasestorage.googleapis.com/v0/b/loycard-f138e.appspot.com/o/images%2FsViOjCNhFwMOqdvTyomN77o9tD63%2Fprofilepic?alt=media&token=56ecad36-ea82-4c66-92ef-1e55eaaf31bc';
        //localStorage.getItem('profilePic');

        image.appendChild(photo);
        image.appendChild(img);
        photocolumn.appendChild(image);

        let firstname = '<div style="margin: 10px;"><b>Business Name:</b> ' + datarecord.businessName + '</div>';
        let lastname = '<div style="margin: 10px;"><b>Email:</b> ' + datarecord.email + '</div>';
        let status;
        if (datarecord.status == "free") {
          status = '<div style="margin: 10px; color:blue"><a style="color:blue" href="/vendor-subscribe/' + datarecord.uid + '"><b style="color:black">Status:</b>SUBSCRIBE</a></div>';
        } else if (datarecord.status == "paid") {
          status = '<div style="margin: 10px; color:red"><b style="color:black">Status:</b><span style="color:green">ACTIVE</span></div>';
        } else {
          status = '<div style="margin: 10px; color:blue"><a style="color:blue" href="/vendor-subscribe/' + datarecord.uid + '"><b style="color:black">Status:</b>SUBSCRIBE</a></div>';
        }
        let address = '<div style="margin: 10px;"><b>Address:</b> ' + datarecord.businessAddress.split(',')[0] + '</div>';
        leftcolumn.insertAdjacentHTML('beforeend', firstname);
        leftcolumn.insertAdjacentHTML('beforeend', lastname);
        leftcolumn.insertAdjacentHTML('beforeend', status);
        leftcolumn.insertAdjacentHTML('beforeend', address)

        let postalcode = '<div style="margin: 10px;"><b>Zip Code:</b> ' + datarecord.zipcode + '</div>';
        let hiredate = '<div style="margin: 10px;"><b>State:</b> ' + datarecord.state + '</div>';
        let city = '<div style="margin: 10px;"><b>City:</b> ' + datarecord.city + '</div>';
        let phone = '<div style="margin: 10px;"><b>Phone:</b> ' + datarecord.contactno + '</div>';

        rightcolumn.insertAdjacentHTML('beforeend', postalcode);
        rightcolumn.insertAdjacentHTML('beforeend', city);
        rightcolumn.insertAdjacentHTML('beforeend', phone);
        rightcolumn.insertAdjacentHTML('beforeend', hiredate);

        new google.maps.Map(document.getElementById('basic-map'), {
          center: { lat: datarecord.latitude, lng: datarecord.longitude },
          zoom: 8
        });

        let notesContainer = document.createElement('div');
        notesContainer.style.cssText = 'white-space: normal; margin: 5px;';
        notesContainer.innerHTML = '<span>' + datarecord.notes + '</span>';

        notes.appendChild(notesContainer);

        tabsdiv.className = 'angularTabs';

        jqwidgets.createInstance('.angularTabs', 'jqxTabs', { width: 780, height: 170 })
      }
    }

  }

  ready() {
  }

  cellBeginEditEvent(event: any) {
    let args = event.args;
  }

  cellEndEditEvent(event: any) {
    let { args: { row: { uid, key } }, args: { value } } = event;

    this.vendorService.getById(key).snapshotChanges().subscribe(vendor => {
      // check vendor exist in firebase
      if (vendor.payload.val()) {
        this.vendorService.getById(key).update({ notes: value });
        let vendorData = vendor.payload.val();
        // check insertedBy is avalible or not
        if (vendorData.insertedBy) {
          // take sales resp vendor
          this.vendorService.getAllSalesRepSingleVendor(vendorData.insertedBy, key).snapshotChanges().subscribe(data => {
            // vendor exists in insertedBy sales Rep
            if (data.payload.val()) {
              // update notes vendor from sales rep vendor list
              this.vendorService.getAllSalesRepSingleVendor(vendorData.insertedBy, key).update({ notes: value })
            }
          });
        }
      }
    });
  }

  customersGridOnRowSelect(event) {
    let key = event.args.row.key;
    this.vendorSelectedRow = key;
    this.subscription = this.vendorService.getAllSalesRepVendor(key).snapshotChanges().subscribe(data => {
      this.vendors = data.map((d) => ({ key: d.payload.key, ...d.payload.val() }));
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
