import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    let version = environment.version;
    let build = environment.build;

    console.log(`Version: ${version} - build: ${build}`)
  }

}
