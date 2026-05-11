import { ChangeDetectorRef, Component } from '@angular/core';
import { Services } from '../service/services';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  isLoading: boolean = false;
  constructor(private cdr: ChangeDetectorRef, private loaderService: Services){
    this.loaderService.loader$.subscribe((res) => {
      this.isLoading = res.open;
      this.cdr.detectChanges();
    })
  }


}