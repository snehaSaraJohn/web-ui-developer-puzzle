import { TestBed, fakeAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { Book, ReadingListItem } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let book: Book;
  const snackBar:MatSnackBar=null;
  let item:ReadingListItem


  const bookItem = createReadingListItem('A');
  const itemBook = createBook('B');

  beforeAll(() => {
    item = createReadingListItem('A');      
    book = createBook('A');
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule,
        MatSnackBarModule
      ]
      ,
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });
  describe('addBook$', () => {
    it('should add a book to the reading list successfully', fakeAsync(() => {
      actions.next(ReadingListActions.addToReadingList({ book  }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
      })

      httpMock.expectOne('/api/reading-list').flush({});
    }));


    it('should undo the added book when API returns error', fakeAsync(() => {
      actions.next(ReadingListActions.addToReadingList({ book}));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book })
        );
      });

      httpMock.expectOne('/api/reading-list').flush({}, { status: 500, statusText: 'server error' });

    }));

    it('show snackbar on add book', async() => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedAddToReadingList({ book }));

      effects.undoAddtoReadingList$.subscribe(() => {
        snackBar.open(`Added ${book.title} to reading list`,'Undo', { duration: 2000}).onAction().subscribe((action)=>{
          expect(action).toEqual(
            ReadingListActions.removeFromReadingList({ item })
        )
        })
      });
    });

  });  

  describe('removeBook$', () => {
    it('should remove book successfully from reading list', done => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({ item})
        );

        done();
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({});
    });


    it('should undo removed book when API returns error', fakeAsync(() => {
      actions.next(ReadingListActions.removeFromReadingList({ item }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
      });

      httpMock.expectOne(`/api/reading-list/${item.bookId}`).flush({}, { status: 500, statusText: 'server error' });
    }));

    it('show snackbar on remove book', async() => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.confirmedRemoveFromReadingList({ item}));

      effects.undoRemoveFromReadingList$.subscribe(() => {
        snackBar.open(`Removed ${item.title} to reading list`,'Undo', { duration: 2000}).onAction().subscribe((action)=>{
          expect(action).toEqual(
            ReadingListActions.addToReadingList({ book})
          );
        })
      });
    });

  });
  
});
