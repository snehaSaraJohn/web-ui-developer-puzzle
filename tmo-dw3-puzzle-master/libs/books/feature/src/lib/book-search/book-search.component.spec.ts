import { async, ComponentFixture, TestBed ,  tick,
  fakeAsync,
  discardPeriodicTasks } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { searchBooks } from '@tmo/books/data-access';
describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule,MatProgressSpinnerModule], providers: [
        provideMockStore({
          initialState: {
            books: {
              entities: []
            }
          }
        }),],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);

  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component.searchForm, 'valueChanges');
      spyOn(store, 'dispatch');
    });

    it('should dispatch searchBooks action to retrieve book details when search term is typed and actual time spent is equal to 500ms', fakeAsync(() => {
      component.ngOnInit();
      component.searchForm.controls.term.setValue('Angular');

      tick(500);

      component.searchForm.valueChanges.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'Angular' }))
      });
    }));
    it('No action should be dispatched when we have value for search term and actual time spent after entering search term is less than 500ms', fakeAsync(() => {
      component.ngOnInit();
      component.searchForm.controls.term.setValue('Java');

      tick(400);

      expect(store.dispatch).not.toHaveBeenCalled();
      discardPeriodicTasks();
    })); 
    it('No task should be called  when we have no value for search', fakeAsync(() => {

      component.searchForm.controls.term.setValue('');

      tick(400);

      expect(store.dispatch).not.toHaveBeenCalled();
      discardPeriodicTasks();
    }));  
  });
});
