import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteServiceRequest, ServiceResponse, ServicesService } from 'src/app/services/apis/services.service';
import { CreateServiceDialogComponent } from './create-service-dialog/create-service-dialog.component';
import { UpdateDialogComponent } from '../home-slide/update-dialog/update-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { UpdateServiceDialogComponent } from './update-service-dialog/update-service-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-service',
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
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss'
})
export class ServiceComponent  implements OnInit {

  items: ServiceResponse[] = [];
  filteredItems: ServiceResponse[] = [];
  searchtext: string = '';
  serviceForm: FormGroup;
  languageCode: string;

  constructor(
    private service: ServicesService,
    private dialog: MatDialog,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.serviceForm = new FormGroup({
      query: new FormControl(''),
    });

   }

  ngOnInit(): void {
    this.loadHomePosts(null);
    this.serviceForm.get('query')?.valueChanges.subscribe(searchText => {
      console.log(searchText);
      this.loadHomePosts(searchText);
    });
  }

  createNewItem() {
    console.log('onCreateNewItem');
    this.dialog.open(CreateServiceDialogComponent).afterClosed().subscribe({
      next: () => {
          this.loadHomePosts();
      }
    });
  }

  editItem(serviceId: string): void {
    console.log('onEditItem:', serviceId);
    this.dialog.open(UpdateServiceDialogComponent, {data: {serviceId: serviceId} }).afterClosed().subscribe({
      next: () => {
        this.loadHomePosts();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deleteItem(serviceId: string): void {
    const deletePostRequest: DeleteServiceRequest = {
      id: serviceId,
    };

    this.service.deleteService(deletePostRequest).subscribe(
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
    this.service.getAllServices().subscribe(
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

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      (item.nameEn && item.nameEn.toLowerCase().includes(lowerQuery)) ||
      (item.nameRu && item.nameRu.toLowerCase().includes(lowerQuery)) ||
      (item.nameUz && item.nameUz.toLowerCase().includes(lowerQuery)) ||
      (item.nameUzRu && item.nameUzRu.toLowerCase().includes(lowerQuery)) ||
      (item.createdAt && item.createdAt.includes(lowerQuery)) ||
      (item.descriptionUz && item.descriptionUz.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionRu && item.descriptionRu.toLowerCase().includes(lowerQuery)) ||
      (item.descriptionUzRu && item.descriptionUzRu.toLowerCase().includes(lowerQuery))
    );
  }

  getTranslatedItem(item: ServiceResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof ServiceResponse] as string;
  }
}
