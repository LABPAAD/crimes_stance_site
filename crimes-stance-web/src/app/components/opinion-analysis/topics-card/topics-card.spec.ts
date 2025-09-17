import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsCard } from './topics-card';

describe('TopicsCard', () => {
  let component: TopicsCard;
  let fixture: ComponentFixture<TopicsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
