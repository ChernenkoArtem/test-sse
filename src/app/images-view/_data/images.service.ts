import { Injectable, NgZone } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ImageSSE } from './interfaces/imagesSSE.interface';

@Injectable()
export class ImagesService {
  sse!: EventSource;
  constructor(private zone: NgZone) {}

  getImage(testNumber: number): Observable<ImageSSE> {
    return new Observable<ImageSSE>((observer) => {
      this.sse = new EventSource(
        `https://devfirmware.maks.systems:8443/api/v1/pictures/download/stream/sse/test?testNumber=${testNumber}`
      );

      this.sse.onmessage = (evt) => {
        this.zone.run(() => {
          observer.next(evt.data);
        });
      };

      this.sse.onerror = (error: Event) => {
        this.zone.run(() => {
          const status = this.sse.readyState; // для коректного порівняння(404 === status) потрібно зі сторони сервера створити кастомний івент і передавати потрібні дані помилки
          observer.error({ status, error });
          this.sse.close();
        });
      };

      return () => this.sse.close();
    }).pipe(
      filter((v) => !!v),
      map((v) => {
        const data: ImageSSE = JSON.parse(v as string | any);
        return this.mappingData(data);
      })
    );
  }

  closeConnection(): void {
    const sseInstance = this.sse;

    if (sseInstance) {
      sseInstance.close();
    }
  }

  mappingData(data: ImageSSE): ImageSSE {
    const correctStr = data.frameData.substring(0, data.frameData.length - 2); // delete 2 last symbols "=="

    return {
      ...data,
      frameData: correctStr,
    };
  }
}
