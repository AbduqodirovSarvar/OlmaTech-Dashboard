import { HelperService } from 'src/app/services/helper.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AboutService, AboutResponse, DeleteAboutRequest } from 'src/app/services/apis/about.service';
import { CommonModule } from '@angular/common';
import { CreateAboutDialogComponent } from './create-about-dialog/create-about-dialog.component';
import { UpdateAboutDialogComponent } from './update-about-dialog/update-about-dialog.component';
import { TranslationPipe } from "../../services/translation.pipe";
import { BaseApiService } from 'src/app/services/apis/base.api.service';

@Component({
  selector: 'app-about',
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
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutForm!: FormGroup;
  items: AboutResponse[] = [];
  filteredItems: AboutResponse[] = [];

  constructor(
    private aboutService: AboutService,
    public dialog: MatDialog,
    private baseApiService: BaseApiService
  ) {
    this.aboutForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadAbout();
    this.aboutForm.get('query')?.valueChanges.subscribe({
      next: (searchText: string) => {
      this.loadAbout(searchText);
    },
      error: (error) => {
        console.error('Error:', error);
    }
    });
  }

  onCreateNewItem(): void {
    this.dialog.open(CreateAboutDialogComponent).afterClosed().subscribe({
      next: () => {
        this.loadAbout(this.aboutForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onEditItem(id: string): void {
    const dialogRef = this.dialog.open(UpdateAboutDialogComponent, {
      data: { aboutId: id }
    });

    dialogRef.afterClosed().subscribe({
      next: () => {
        this.loadAbout(this.aboutForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deletePost(id: string): void {
    const command: DeleteAboutRequest = { Id: id };
    this.aboutService.deleteAbout(command).subscribe({
      next: () => {
        this.loadAbout(this.aboutForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getPhoto(item: AboutResponse): string {
    return this.baseApiService.getPhoto(item.photo);
  }

  loadAbout(searchText?: string | null): void {
    this.aboutService.getAllAbout().subscribe({
      next: (data) => {
        if (searchText) {
          this.onSearch(searchText);
          this.items = this.filteredItems;
        } else {
          this.items = data;
          this.filteredItems = data;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.titleEn && item.titleEn.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (item.titleUz && item.titleUz.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUz && item.descriptionUz.toLowerCase().includes(lowerQuery)) ||
      (item.titleRu && item.titleRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionRu && item.descriptionRu.toLowerCase().includes(lowerQuery)) ||
      (item.titleUzRu && item.titleUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUzRu && item.descriptionUzRu.toLowerCase().includes(lowerQuery))
    );
  }
}
