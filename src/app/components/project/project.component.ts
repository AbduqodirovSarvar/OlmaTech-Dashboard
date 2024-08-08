import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectService, ProjectResponse, CreateProjectRequest } from 'src/app/services/apis/project.service';
import { CommonModule } from '@angular/common';
import { CreateProjectDialogComponent } from './create-project-dialog/create-project-dialog.component';
import { UpdateProjectDialogComponent } from './update-project-dialog/update-project-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { BaseApiService } from 'src/app/services/apis/base.api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-project',
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
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup;
  items: ProjectResponse[] = [];
  filteredItems: ProjectResponse[] = [];
  languageCode: string;

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private baseApiService: BaseApiService,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.projectForm = new FormGroup({
      query: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.projectForm.get('query')?.valueChanges.subscribe(searchText => {
      this.loadProjects(searchText);
    });
  }

  onCreateNewItem(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadProjects(this.projectForm.get('query')?.value);
      }
    });
  }

  onEditItem(id: string): void {
    const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
      width: '500px',
      data: { projectId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadProjects(this.projectForm.get('query')?.value);
      }
    });
  }

  deletePost(id: string): void {
    const command = { id };
    this.projectService.deleteProject(command).subscribe({
      next: () => {
        this.loadProjects(this.projectForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getPhoto(item: ProjectResponse): string {
    return this.baseApiService.getPhoto(item.photo);
  }

  loadProjects(searchText?: string | null): void {
    this.projectService.getAllProjects().subscribe(
      {
        next: (data) => {
          if (searchText) {
            this.onSearch(searchText);
            this.items = this.filteredItems;
          } else {
            this.items = data;
            this.items = data;
          }
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.nameUz && item.nameUz.toLowerCase().includes(lowerQuery)) ||
      (item.nameEn && item.nameEn.toLowerCase().includes(lowerQuery)) ||
      (item.nameRu && item.nameRu.toLowerCase().includes(lowerQuery)) ||
      (item.nameUzRu && item.nameUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUz && item.descriptionUz.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionRu && item.descriptionRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUzRu && item.descriptionUzRu.toLowerCase().includes(lowerQuery))
    );
  }

  getTranslatedItem(item: ProjectResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof ProjectResponse] as string;
  }
}
