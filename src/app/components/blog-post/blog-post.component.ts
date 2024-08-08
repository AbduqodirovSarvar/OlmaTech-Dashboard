import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { BlogPostResponse, BlogService, DeleteBlogPostCommand } from 'src/app/services/apis/blog.service';
import { UpdateBlogPostDialogComponent } from './update-blog-post-dialog/update-blog-post-dialog.component';
import { CreateBlogPostDialogComponent } from './create-blog-post-dialog/create-blog-post-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { BaseApiService } from 'src/app/services/apis/base.api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule, // Added ReactiveFormsModule
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule,
    CommonModule,
    TranslationPipe
  ],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {

  items: BlogPostResponse[] = [];
  filteredItems: BlogPostResponse[] = [];
  searchtext: string = '';
  blogPostForm: FormGroup;
  languageCode: string;

  constructor(
    private blogPostService: BlogService,
    private dialog: MatDialog,
    private baseApiService: BaseApiService,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.blogPostForm = new FormGroup({
      query: new FormControl(''),
    });

   }

  ngOnInit(): void {
    this.loadBlogPosts(null);
    this.blogPostForm.get('query')?.valueChanges.subscribe(searchText => {
      console.log(searchText);
      this.loadBlogPosts(searchText);
    });
  }

  onCreateNewItem() {
    console.log('onCreateNewItem');
    this.dialog.open(CreateBlogPostDialogComponent).afterClosed().subscribe({
      next: () => {
          this.loadBlogPosts();
      }
    });
  }

  onEditItem(blogId: string): void {
    this.dialog.open(UpdateBlogPostDialogComponent, {data: {blogId: blogId} }).afterClosed().subscribe({
      next: () => {
        this.loadBlogPosts();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deletePost(postId: string): void {
    const deletePostRequest: DeleteBlogPostCommand = {
      Id: postId,
    };

    this.blogPostService.deleteBlogPost(deletePostRequest).subscribe(
      {
        next: () => {
          console.log('Post deleted successfully');
          this.loadBlogPosts();
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }


  loadBlogPosts(searchText?: string | null): void {
    this.blogPostService.getAllBlogPosts().subscribe(
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

  getPhoto(item: BlogPostResponse): string {
    return this.baseApiService.getPhoto(item.photo);
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.titleUz && item.titleUz.toLowerCase().includes(lowerQuery)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(lowerQuery)) ||
      (item.titleRu && item.titleRu.toLowerCase().includes(lowerQuery)) ||
      (item.titleUzRu && item.titleUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUz && item.descriptionUz.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionRu && item.descriptionRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUzRu && item.descriptionUzRu.toLowerCase().includes(lowerQuery))
    );
  }

  getTranslatedItem(item: BlogPostResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof BlogPostResponse] as string;
  }
}

