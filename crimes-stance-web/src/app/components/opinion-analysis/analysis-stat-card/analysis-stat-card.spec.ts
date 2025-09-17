import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisStatCardComponent } from './analysis-stat-card';

describe('AnalysisStatCardComponent', () => {
  let component: AnalysisStatCardComponent;
  let fixture: ComponentFixture<AnalysisStatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisStatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisStatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
