import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { forEach } from '@angular/router/src/utils/collection';
import { AngularFireAuth } from 'angularfire2/auth';
import * as _ from 'lodash';
import 'rxjs/operators/map';
@Injectable()
export class VendorService {

  vendors;
  customers = [];
  rows2 = [];
  constructor(private afdb: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  getAll() {
    if (localStorage.getItem('userrole') === '1') {
      const loggedInUserId = localStorage.getItem('userId');

      const vendors = this.afdb.list('/Representatives/' + loggedInUserId + '/vendors');
      return vendors;
    } else {
      const vendors = this.afdb.list('/Vendors');
      return vendors;
    }
  }

  getById(vendorId) {
    return this.afdb.object('/Vendors/' + vendorId)
  }

  getCustomers() {
    if (localStorage.getItem('userrole') === '2') {
      const loggedInUserId = localStorage.getItem('userId');

      // this.afdb.list(`/Subscriptions/${loggedInUserId}` ).valueChanges().subscribe((data) => {
      //   console.log(data.$key);
      //   // for ( const customer in data ) {
      //   //   if (data.hasOwnProperty(customer)) {
      //   //   // const customerId = customer;

      //   //     this.customers.push(customer);

      //   //   }

      //   // }
      //   // this.customers.forEach((cus) => {
      //   //   this.afdb.object(`/Role/${cus}`).valueChanges().subscribe(data2 => {
      //   //     console.log(data2);
      //   //     this.rows2.push({ name: _.get(data2, 'name'), email: _.get(data2, 'email') });

      //   //   });
      //   // })
      //   // console.log('ROWS: ', this.rows2);

      // });

      // this.afdb.list(`/Subscriptions/${loggedInUserId}`).snapshotChanges().subscribe(items => {
      //   this.customers = [];
      //   items.map(item => {
      //     const customerId = item.key;
      //     return this.afdb.object(`/Role/${customerId}`).valueChanges().subscribe((cus) => {
      //       this.customers.push(cus);
      //     });
      //   })
      // })

      return this.afdb.list(`/Subscriptions/${loggedInUserId}`);
    }
    // return this.customers;
  }

  getAllSalesRepVendor(id) {
    const vendors = this.afdb.list('/Representatives/' + id + '/vendors');
    return vendors;
  }

  removeVendor(id){
    const vendors = this.afdb.list('/Vendors/' + id );
    return vendors.remove();
  }

  removeSalesRepVendor(salesrepId, vendorId){
    const vendors = this.afdb.list('/Representatives/' + salesrepId + '/vendors/' + vendorId);
    return vendors.remove();
  }

  getBySalesRepId(salesrepId) {
    return this.afdb.object('/Representatives/' + salesrepId)
  }

  getBySalesRepVendorById(salesrepId , vendorId) {
    return this.afdb.object('/Representatives/' + salesrepId + '/vendors/' + vendorId);
  }

  getAllSalesRepSingleVendor(id, vendorId) {
    const vendors = this.afdb.object('/Representatives/' + id + '/vendors/' + vendorId);
    return vendors;
  }

}
