import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SalesrepService {

  constructor(private afdb: AngularFireDatabase) { }

  getAll() {
    const salesreps = this.afdb.list('/Representatives');
    return salesreps;
  }

  getById(salesrepId) {
    return this.afdb.object('/Representatives/' + salesrepId);
  }

  getAllRemove(key: string) {
    const salesreps = this.afdb.object('/Representatives');
    salesreps.remove();
  }


  removeSalesRep(id) {
    const salesRep = this.afdb.list('/Representatives/' + id);
    return salesRep.remove();
  }
}
