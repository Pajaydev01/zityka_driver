import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, map, last } from "rxjs/operators";

@Injectable()
export class BmpapiProvider {
  url;
  url2;
  public token: string;
  percentage: any = 0;
  response: any;

  constructor(public http: HttpClient) {
    console.log('Hello BmpapiProvider Provider');
    // this.url = 'https://bmpcar.com/api/v1';
    // this.url2 = 'https://bmpcar.com/api/v1/vip';
    this.url = 'https://zityka.com/api/v1';
    this.url2 = 'https://zityka.com/api/v1/vip';
  }

  // //try ana get ring tone here
  // get_tone(){
  // 	return this.http.get("./././assets/tones/high-volume.mp3");
  // }
  //

  cancelTrip(jwt, id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    let body = {
      tripId: id,
      type: 'vip'
    }
    return this.http.post(this.url2 + '/trip/cancelTrip', JSON.stringify(body), { headers });

  }

  expire(jwt, id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    let body = {
      rideId: id
    }
    return this.http.post(this.url2 + '/trip/expire', JSON.stringify(body), { headers });

  }

  login(email, password) {

    let body = {
      email: email,
      password: password,
      token: this.token
    }

    console.log(body);

    return this.http.post(this.url2 + '/driver/login', JSON.stringify(body));
  }

  register(body) {
    //  register(email, firstname, lastname, phone, location, rideType, bankType, account, color, selfie, doc, id, ins, car_photo, license)
    // let body = {
    //   email: email,
    //   firstName: firstname,
    //   lastName: lastname,
    //   phone: phone,
    //   location: location,
    //   rideType: rideType,
    //   bankType: bankType,
    //   accountNumber: account,
    //   color: color,
    //   selfie: selfie,
    //   v_document: doc,
    //   passport: id,
    //   insurance: ins,
    //   car_photo: car_photo,
    //   license: license
    // }

    // return this.http.post(this.url2 + '/signup', JSON.stringify(body), {
    //   reportProgress: true,
    //   observe: 'events',
    // })

    return this.http.post(this.url2 + '/signup_2', JSON.stringify(body), {
      reportProgress: true,
      observe: 'events',
    })
  }

  driver_profile(user_id) {
    let body = {
      res: 'by'
    }
    return this.http.post(this.url2 + '/profile/' + user_id, JSON.stringify(body));

  }

  driver_withdraw(user_id) {
    let body = {
      res: 'ds'
    }
    return this.http.post(this.url2 + '/profile/withdraw/' + user_id, JSON.stringify(body));

  }

  ride_history(jwt) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    let body = {
      nothing: 'nothing'
    }

    return this.http.post(this.url2 + '/trip/history/driver', JSON.stringify(body), {
      headers, reportProgress: true,
      observe: 'events',
    })

  }

  ends(jwt, id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    let body = {
      rideId: id
    }
    return this.http.post(this.url2 + '/trip/stats', JSON.stringify(body), { headers });

  }

  checker(jwt, id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    let body = {
      rideId: id
    }
    return this.http.post(this.url2 + '/trip/checker', JSON.stringify(body), { headers });

  }

  update_location(jwt, latlngs, user_id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
      user_id: user_id,
      location: latlngs
    }

    return this.http.post(this.url2 + '/profile/update-location', JSON.stringify(body), { headers });

  }

  token_update(jwt, user_id) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
      token: this.token
    }

    console.log(body);
    console.log(user_id);

    return this.http.post(this.url2 + '/profile/' + user_id + '/update-token', JSON.stringify(body), { headers });

  }

  triplookup(jwt, triedIDs) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
      triedIDs: triedIDs
    }

    return this.http.post(this.url2 + '/trip_background', JSON.stringify(body), { headers });

  }

  accept_ride(jwt, rideid) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
    }

    return this.http.post(this.url2 + '/trip/' + rideid + '/accept', JSON.stringify(body), { headers });

  }

  update_loc(jwt, rideid, lng, lat) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
      rideid: rideid,
      lat: lat,
      lng: lng
    }

    return this.http.post(this.url2 + '/trip/location', JSON.stringify(body), { headers });

  }

  driver_arrived(jwt, rideid) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
    }

    return this.http.post(this.url2 + '/trip/' + rideid + '/driver-arrived', JSON.stringify(body), { headers });

  }

  start_trip(jwt, rideid) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
    }

    return this.http.post(this.url2 + '/trip/' + rideid + '/start', JSON.stringify(body), { headers });

  }

  end_trip(jwt, rideid) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });

    let body = {
    }

    return this.http.post(this.url2 + '/trip/' + rideid + '/end', JSON.stringify(body), { headers });

  }

  update_driver_loc(jwt, body) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + jwt,
    });
    return this.http.post(this.url2 + '/trip/radius', JSON.stringify(body), { headers });
  }

}
