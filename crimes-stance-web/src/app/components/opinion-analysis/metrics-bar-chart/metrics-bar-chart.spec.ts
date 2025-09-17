import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsBarChart } from './metrics-bar-chart';

describe('MetricsBarChart', () => {
  let component: MetricsBarChart;
  let fixture: ComponentFixture<MetricsBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsBarChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsBarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
