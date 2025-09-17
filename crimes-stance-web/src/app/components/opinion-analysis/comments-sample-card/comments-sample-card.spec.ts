import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSampleCard } from './comments-sample-card';

describe('CommentsSampleCard', () => {
  let component: CommentsSampleCard;
  let fixture: ComponentFixture<CommentsSampleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsSampleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsSampleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
