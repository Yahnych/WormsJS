import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { WormsPlayerListComponent } from '../components/worms-player-list/worms-player-list.component';

@NgModule({
  declarations: [
    AppComponent,
    WormsPlayerListComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
