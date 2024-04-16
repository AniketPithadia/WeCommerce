import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchInput: '',
    });
  }

  onSearch(): void {
    const query: string =
      this.searchForm.get('searchInput')?.value?.trim() || '';
    console.log('Inside serah query', query);
    this.searchEvent.emit(query);
  }
}
