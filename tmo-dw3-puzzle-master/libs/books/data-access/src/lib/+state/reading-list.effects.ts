import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { Store } from '@ngrx/store';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
const Snack_Bar_config= {
  UNDO: 'Undo',
  DURATION: 4000
}

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );
  undoAddtoReadingList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ReadingListActions.confirmedAddToReadingList),
    filter(({ book }) => book.isSnackBarOpen),
    map(({ book }) =>
    this.snackBar.open(`${book.title}: added to the  reading list`, Snack_Bar_config.UNDO, {
      duration: Snack_Bar_config.DURATION
    })
      .onAction()
      .subscribe(() =>
  
          this.store.dispatch(
            ReadingListActions.removeFromReadingList({
              item:  { ...book, bookId: book.id, isSnackBarOpen: false } as ReadingListItem
            })
          
          )
      )
    ),
  ),
  { dispatch: false }
  );
  
  undoRemoveFromReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter(({ item }) => item.isSnackBarOpen),
      map(({ item }) =>
      this.snackBar.open(`${item.title}: removed from the reading list`, Snack_Bar_config.UNDO, {
        duration: Snack_Bar_config.DURATION
      })
        .onAction()
        .subscribe(() =>
            this.store.dispatch(
              ReadingListActions.addToReadingList({
                book: { ...item, id: item.bookId, isSnackBarOpen: false } as Book
              })
            )
        )
      )
    ),
    { dispatch: false }
  );
  
  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient,private readonly snackBar: MatSnackBar,
    private readonly store: Store) {}
}
