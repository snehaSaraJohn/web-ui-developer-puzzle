import { Component, OnInit } from '@angular/core';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent  {
  books$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  getBooksLoaded$: Observable<boolean> = this.store.select(getBooksLoaded);
  getBooksError$: Observable<string> = this.store.select(getBooksError);
  error_text = 'No Result Found';
  MATSPINNER_DIAMETER= 40;
  MATSPINNER_STROKE_WIDTH = 2;

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

  addBookToReadingList(book: Book):void {
    this.store.dispatch(addToReadingList({ book: { ...book, isSnackBarOpen: true } }));

  }
  searchExample():void {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks():void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
