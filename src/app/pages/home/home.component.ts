import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { BackendService } from 'src/app/services/backend.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  loading: boolean = false;
  displayedColumns: string[] = ['name', 'description', 'stream', 'action'];

  stations: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  constructor(
    private backendService: BackendService
  ) {

    this.backendService.getStations()
      .subscribe(res => {
        this.stations = [];
        console.log('stations', res);

        if (res && Array.isArray(res)) {
          res.forEach(element => {
            element = JSON.parse(element);
            this.stations.push(element)

          });
        }
        this.dataSource.data = this.stations;
        console.log('stations parsed  ', this.stations);
      })
  }

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
