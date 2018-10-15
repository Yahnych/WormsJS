import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WormsPlayerListComponent } from './worms-player-list.component';

describe('WormsPlayerListComponent', () => {
  let component: WormsPlayerListComponent;
  let fixture: ComponentFixture<WormsPlayerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WormsPlayerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WormsPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
