import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  constructor() { }


  p: any = '1';
  entriesPerPage: any = '10';

  ngOnInit(): void {
  }

  pagination(event) {
  }
}
