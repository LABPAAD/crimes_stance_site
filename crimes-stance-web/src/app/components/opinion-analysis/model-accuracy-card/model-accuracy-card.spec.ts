import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelAccuracyCard } from './model-accuracy-card';

describe('ModelAccuracyCard', () => {
  let component: ModelAccuracyCard;
  let fixture: ComponentFixture<ModelAccuracyCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelAccuracyCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelAccuracyCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
