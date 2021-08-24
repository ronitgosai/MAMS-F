import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective implements OnInit {

  @Input() id: number;
  @Input() data: any;

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  txtsize = '500';

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.style.color = this.data;
    // this.elementRef.nativeElement.style.color = this.id == 0 ? 'blue' : this.id == 1 ? 'green' : 'red';
    this.elementRef.nativeElement.style.fontWeight = this.id == 0 ? this.txtsize : this.id == 1 ? this.txtsize : this.txtsize;
  }
}
