  import { Injectable } from '@angular/core';
@Injectable()
export class dataService {
datas:any;
  constructor() {

  }


//get information here
store_datas(datas){
  this.datas=datas;
}

pull_datas(){
  return this.datas;
}
}
