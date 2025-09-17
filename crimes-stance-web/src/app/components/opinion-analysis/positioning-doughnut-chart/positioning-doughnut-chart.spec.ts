import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositioningDoughnutChart } from './positioning-doughnut-chart';

describe('PositioningDoughnutChart', () => {
  let component: PositioningDoughnutChart;
  let fixture: ComponentFixture<PositioningDoughnutChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositioningDoughnutChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositioningDoughnutChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
