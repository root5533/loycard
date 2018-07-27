import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesrepService } from '../salesrep.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import * as atoastr from '../../common/toastr';
@Component({
  selector: 'app-salesrep-edit',
  templateUrl: './salesrep-edit.component.html',
  styleUrls: ['./salesrep-edit.component.scss']
})
export class SalesrepEditComponent implements OnInit {
  salesrep: any = {};
  config = {};
  secondaryApp: any;
  userRole: String = '';
  constructor(private route: ActivatedRoute, private router: Router, private salesrepService: SalesrepService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRole = localStorage.getItem('userrole');
    if (id) {
     this.salesrepService.getById(id).valueChanges().take(1).subscribe((s) => {
       this.salesrep = s;
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
  }

  updateSalesRep(formData: NgForm) {
    if (formData.valid) {
      const formValues = formData.value;
      const req = {
        contactno: formValues.contactno
      }

      this.secondaryApp.database().ref(`/Role/${this.route.snapshot.paramMap.get('id')}`).update(req)
      .then(() => {
        // formData.reset();
        if (this.userRole === '0') {
          this.updateRepresentativesTable(req);
        } else if (this.userRole === '2') {
        //  this.updateVendorsTable(req);
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
    this.secondaryApp.database().ref(`/Representatives/${this.route.snapshot.paramMap.get('id')}`).update(req)
      .then((resp) => {
        atoastr.showSuccess('Updated info');
        // this.router.navigate(['/profile']);
      }).catch((err) => {
        atoastr.showError('Failed to update');
        console.log('ERROR (update representatives) : ', err);
      })
  }

  onClickCancel () {
    this.router.navigate(['/salesrep-list']);
  }


}
