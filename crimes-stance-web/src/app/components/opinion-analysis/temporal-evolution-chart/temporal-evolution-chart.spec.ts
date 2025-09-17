import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalEvolutionChart } from './temporal-evolution-chart';

describe('TemporalEvolutionChart', () => {
  let component: TemporalEvolutionChart;
  let fixture: ComponentFixture<TemporalEvolutionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalEvolutionChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporalEvolutionChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
