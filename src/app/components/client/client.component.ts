import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ClientService, ClientResponse, DeleteClientRequest } from 'src/app/services/apis/client.service';
import { CreateClientDialogComponent } from './create-client-dialog/create-client-dialog.component';
import { UpdateClientDialogComponent } from './update-client-dialog/update-client-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { BaseApiService } from 'src/app/services/apis/base.api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-client',
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
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  clients: ClientResponse[] = [];
  filteredClients: ClientResponse[] = [];
  searchText: string = '';
  clientForm: FormGroup;
  languageCode: string;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private baseApiService: BaseApiService,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.clientForm = new FormGroup({
      query: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadClients(null);
    this.clientForm.get('query')?.valueChanges.subscribe(searchText => {
      this.loadClients(searchText);
    });
  }

  onCreateNewClient() {
    this.dialog.open(CreateClientDialogComponent).afterClosed().subscribe({
      next: () => {
        this.loadClients(this.clientForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onEditClient(clientId: string): void {
    this.dialog.open(UpdateClientDialogComponent, { data: { clientId: clientId } }).afterClosed().subscribe({
      next: () => {
        this.loadClients();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deleteClient(clientId: string): void {
    const deleteClientRequest: DeleteClientRequest = {
      Id: clientId,
    };

    this.clientService.deleteClient(deleteClientRequest).subscribe({
      next: () => {
        this.loadClients(this.clientForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  loadClients(searchText?: string | null): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        if (searchText) {
          this.onSearch(searchText);
          this.clients = this.filteredClients;
        } else {
          this.clients = data;
          this.filteredClients = data;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getPhoto(client: ClientResponse): string {
    return this.baseApiService.getPhoto(client.photo);
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      (client.firstname && client.firstname.toLowerCase().includes(lowerQuery)) ||
      (client.firstnameRu && client.firstnameRu.toLowerCase().includes(lowerQuery)) ||
      (client.lastname && client.lastname.toLowerCase().includes(lowerQuery)) ||
      (client.lastnameRu && client.lastnameRu.toLowerCase().includes(lowerQuery)) ||
      (client.positionUz && client.positionUz.toLowerCase().includes(lowerQuery)) ||
      (client.positionEn && client.positionEn.toLowerCase().includes(lowerQuery)) ||
      (client.positionRu && client.positionRu.toLowerCase().includes(lowerQuery)) ||
      (client.positionUzRu && client.positionUzRu.toLowerCase().includes(lowerQuery))
    );
  }

  getTranslatedName(item: ClientResponse, name: string): string {
    let key = name;
    if(this.languageCode === "Ru" || this.languageCode === "UzRu"){
      key = key + "Ru";
    }
    return item[key as keyof ClientResponse] as string;
  }

  getTranslatedItem(item: ClientResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof ClientResponse] as string;
  }
}
