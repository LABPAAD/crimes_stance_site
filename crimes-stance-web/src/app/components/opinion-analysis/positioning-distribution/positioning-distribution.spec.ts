import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositioningDistribution } from './positioning-distribution';

describe('PositioningDistribution', () => {
  let component: PositioningDistribution;
  let fixture: ComponentFixture<PositioningDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositioningDistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositioningDistribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
