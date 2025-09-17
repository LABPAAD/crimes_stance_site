import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapResultsCard } from './bootstrap-results-card';

describe('BootstrapResultsCard', () => {
  let component: BootstrapResultsCard;
  let fixture: ComponentFixture<BootstrapResultsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BootstrapResultsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapResultsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
