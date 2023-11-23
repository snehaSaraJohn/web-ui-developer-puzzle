
**Problems and code smells observed:**


1.	Observable used for this.store.select(getAllBooks) is not unsubscribed in book-search.component.ts file. This may lead to memory leaks and performance issues. Added async pipe in `book-search.component.html` file line#32
2.	The naming convention of variables are not proper in `book-search.component.html`,`book-search.component.ts` and `reading-list.component.html`.Corrected the naming convention in both files.
3.	Mobile UX was not correctly rendered in Book sections area,` want to read` buttons were overlapping. Corrected mobile view by adding appropriate css element in `book-search.component.scss` to provide a better user experience
4.	Return Type Notation is missing for functions such as `addBookToReadingList`, `searchExample`, and `searchBooks`.Added return type notation for above functions in `reading-List.component.ts` & `reading-list.reducer.ts`.
5.	 “submit” used instead of” ngsubmit”  in `book-search.component.html`.Corrected it to ngSubmit as it is a reactive module
6. The function `formateDate()` is used for date format in `book-search.component.html` .Replaced that function with Datepipe to convert date into the required format as the pipe will evaluate the expression only once while the function will be triggered every time on change detection.
7.	Test cases were broken for the `reading-list.reducer.ts` because `failedAddToReadingList` and `failedRemoveFromReadingList` were not implemented in reducer.


**Improvements Implemented**

1.	Spinners are implemented for a better user experience for search API. Updated the code with mat Spinner 
2.	Error handling is not proper for the API failure scenario. It should display an error message when there is a failure. Updated code to display an error message. 


**Accessibility**

**Automated scan issues and solution**

1.	Buttons do not have an accessible name. `SOLVED`
2.	Background and foreground do not have a sufficient contrast ratio. ` SOLVED `

**Manually checked**

1.	Added `aria-label` to the `Search icon` to make this more meaningful for the user. ` SOLVED `
2.	Alt attribute is missing in `reading-list.component.html` for the image tag at line#4.Added `alt="book-cover"` in the image tag. ` SOLVED `
3.	`Javascript` is wrapped in an anchor tag in `book-search.component.html` . Changed it to a button element. ` SOLVED `
4.	Added `aria-label` for `Want to read` button to make it read with book name. `SOLVED`
5.  Added `alt` attribute to `img` tags as it specifies an alternate text for image in case the image is not loaded in `book-search component.html`.`SOLVED`