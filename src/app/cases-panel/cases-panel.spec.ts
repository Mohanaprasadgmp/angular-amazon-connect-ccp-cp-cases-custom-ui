import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesPanel } from './cases-panel';

describe('CasesPanel', () => {
  let component: CasesPanel;
  let fixture: ComponentFixture<CasesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
