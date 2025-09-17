import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedMetricsCard } from './detailed-metrics-card';

describe('DetailedMetricsCard', () => {
  let component: DetailedMetricsCard;
  let fixture: ComponentFixture<DetailedMetricsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedMetricsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedMetricsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
