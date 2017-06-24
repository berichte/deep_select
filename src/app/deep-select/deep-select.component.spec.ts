import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepSelectComponent } from './deep-select.component';

describe('DeepSelectComponent', () => {
  let component: DeepSelectComponent;
  let fixture: ComponentFixture<DeepSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeepSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeepSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
