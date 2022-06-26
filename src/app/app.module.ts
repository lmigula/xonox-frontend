import { NgModule, LOCALE_ID } from '@angular/core';
import {
  LocationStrategy,
  HashLocationStrategy,
  registerLocaleData
} from '@angular/common';

import localeDE from "@angular/common/locales/de";

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BrowserModule } from '@angular/platform-browser';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './pages/home/home.component';
import { StationComponent } from './pages/station/station.component';
import { BackendService } from './services/backend.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AboutComponent } from './pages/about/about.component';


registerLocaleData(localeDE, "de");

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    StationComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    LayoutModule,
    MaterialModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: LOCALE_ID,
      useValue: "de"
    },
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
