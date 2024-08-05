import { Component, NgModule, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { DeleteHomePostRequest, HomePostResponse, HomepostService } from 'src/app/services/apis/homepost.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { BaseApiService } from 'src/app/services/apis/base.api.service';

@Component({
  selector: 'app-home-slide',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule,
    CommonModule,
    TranslationPipe
  ],
  templateUrl: './home-slide.component.html',
  styleUrls: ['./home-slide.component.scss']
})
export class HomeSlideComponent implements OnInit {

  items: HomePostResponse[] = [];
  filteredItems: HomePostResponse[] = [];
  searchtext: string = '';
  homeSlideForm: FormGroup;

  constructor(
    private homepostService: HomepostService,
    private dialog: MatDialog,
    private baseApiService: BaseApiService
  ) {
    this.homeSlideForm = new FormGroup({
      query: new FormControl(''),
    });

   }

  ngOnInit(): void {
    this.loadHomePosts(null);
    this.homeSlideForm.get('query')?.valueChanges.subscribe(searchText => {
      console.log(searchText);
      this.loadHomePosts(searchText);
    });
  }

  onCreateNewItem() {
    console.log('onCreateNewItem');
    this.dialog.open(CreateDialogComponent).afterClosed().subscribe({
      next: () => {
          this.loadHomePosts();
      }
    });
  }

  onEditItem(postId: string): void {
    console.log('onEditItem:', postId);
    this.dialog.open(UpdateDialogComponent, {data: {postId: postId} }).afterClosed().subscribe({
      next: () => {
        this.loadHomePosts();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deletePost(postId: string): void {
    const deletePostRequest: DeleteHomePostRequest = {
      Id: postId,
    };

    this.homepostService.deleteHomePost(deletePostRequest).subscribe(
      {
        next: () => {
          console.log('Post deleted successfully');
          this.loadHomePosts();
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }

  loadHomePosts(searchText?: string | null): void {
    this.homepostService.getAllHomePosts().subscribe(
      {
        next: (data) => {
          if(searchText) {
            this.onSearch(searchText);
            this.items = this.filteredItems;
          }
          else {
            this.items = data;
            this.filteredItems = data;
          }
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }

  getPhoto(item: HomePostResponse): string {
    return this.baseApiService.getPhoto(item.photo);
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.titleUz && item.titleUz.toLowerCase().includes(lowerQuery)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(lowerQuery)) ||
      (item.titleRu && item.titleRu.toLowerCase().includes(lowerQuery)) ||
      (item.titleUzRu && item.titleUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.subtitleUz && item.subtitleUz.toLowerCase().includes(lowerQuery)) ||
      (item.subtitleEn && item.subtitleEn.toLowerCase().includes(lowerQuery)) ||
      (item.subtitleRu && item.subtitleRu.toLowerCase().includes(lowerQuery)) ||
      (item.subtitleUzRu && item.subtitleUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUz && item.descriptionUz.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionRu && item.descriptionRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUzRu && item.descriptionUzRu.toLowerCase().includes(lowerQuery))
    );
  }
}
