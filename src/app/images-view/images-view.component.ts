import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImagesService } from './_data/images.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-images-view',
  templateUrl: './images-view.component.html',
  styleUrls: ['./images-view.component.scss'],
})
export class ImagesViewComponent implements OnInit, OnDestroy {
  imageSrc!: string;
  isError = false;
  isLoad = false;
  inputValue!: number;
  private unsubscribeAll: Subject<any> = new Subject();

  constructor(private imagesService: ImagesService) {}

  ngOnInit(): void {
    this.initialSrc();
  }

  imageHendler(): void {
    this.imagesService.closeConnection();
    this.initialSrc();

    this.imagesService
      .getImage(this.inputValue)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (data) => {
          this.isError = false;
          this.isLoad = true;
          this.imageSrc = this.imageSrc + data.frameData;
        },
        error: ({ status, error }) => {
          console.log(status);
          if (status === this.imagesService.sse.CLOSED) {
            this.isError = true;
          }
        },
      });
  }

  initialSrc(): void {
    this.imageSrc = 'data:image/jpeg;base64,';
  }

  ngOnDestroy(): void {
    this.isLoad = false;
    this.unsubscribeAll.complete();
  }
}
