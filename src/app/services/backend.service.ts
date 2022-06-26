import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  url: string = 'station';

  constructor(private httpClient: HttpClient) {
  }


  getStations() {
    return this.httpClient.get(this.url);
  }

  getStation(stationId: string) {
    return this.httpClient.get(this.url + '/' + stationId);
  }


  createStation(station: any) {
    return this.httpClient.post(this.url, station);
  }

  deleteStation(stationId: string) {
    return this.httpClient.delete(this.url + '/' + stationId);
  }

}
