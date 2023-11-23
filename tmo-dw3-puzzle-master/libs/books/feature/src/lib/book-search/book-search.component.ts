import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError,
  getBooksLoaded,
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit,OnDestroy  {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  getBooksLoaded$: Observable<boolean> = this.store.select(getBooksLoaded);
  getBooksError$: Observable<string> = this.store.select(getBooksError);
  error_text = 'No Result Found';
  MATSPINNER_DIAMETER= 40;
  MATSPINNER_STROKE_WIDTH = 2;
 private unsubscribeObservable$: Subject<void> = new Subject();
  searchForm = this.form.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly form: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }
  ngOnInit(): void {
    this.searchForm.get('term').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.unsubscribeObservable$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(searchBooks({ term: searchTerm }));
        } else {
          this.store.dispatch(clearSearch());
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeObservable$.next();
    this.unsubscribeObservable$.complete();
  }

  addBookToReadingList(book: Book):void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample():void {
    this.searchForm.controls.term.setValue('javascript');
  }

}
