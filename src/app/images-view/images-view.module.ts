import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesViewComponent } from './images-view.component';
import { ImagesService } from './_data/images.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ImagesViewComponent,
  },
];

@NgModule({
  declarations: [ImagesViewComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule],
  providers: [ImagesService],
})
export class ImagesViewModule {}
