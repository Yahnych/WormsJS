import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import { WormsPlayerListComponent } from '../components/worms-player-list/worms-player-list.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "../modules/material.module";
import { WormsGameComponent } from '../components/worms-game/worms-game.component';

@NgModule({
  declarations: [
    AppComponent,
    WormsPlayerListComponent,
    WormsGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
