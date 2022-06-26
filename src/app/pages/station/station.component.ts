import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  stationId!: string;
  station: any;
  stationForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    stream: ['', [Validators.required]],
    description: ['',],

  });

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {




    this.route.params
      .subscribe(params => {
        console.log('params', params);
        if (params['stationId']) {

          this.stationId = params['stationId'];
          this.backendService.getStation(this.stationId)
            .subscribe((res: any) => {
              this.station = JSON.parse(res);
              console.log('this.station ', this.station);

              this.stationForm.disable({ emitEvent: false });
              this.stationForm.patchValue(this.station, { emitEvent: false });
            });
        }
      })

  }

  ngOnInit(): void {
  }


  deleteStation() {
    this.backendService.deleteStation(this.stationId)
      .subscribe(res => {
        console.log('saveRes', res);
        this.router.navigate(['/home']);
      })
  }

  submit() {
    let station = this.stationForm.value;
    console.log('station', station);
    let newStation = {
      streamUrl: station.stream,
      name: station.name,
      description: station.description
    }

    //streamUrl
    console.log('save', newStation);
    this.backendService.createStation(newStation)
      .subscribe(res => {
        console.log('saveRes', res);
        this.router.navigate(['/home']);
      })
  }
}
