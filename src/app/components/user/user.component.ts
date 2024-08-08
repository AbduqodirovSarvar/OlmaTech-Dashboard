import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUserRequest, UserResponse, UserService } from 'src/app/services/apis/user.service';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { UpdateUserDialogComponent } from './update-user-dialog/update-user-dialog.component';
import { CommonModule } from '@angular/common';
import { HelperService } from 'src/app/services/helper.service';
import { BaseApiService, EnumResponse } from 'src/app/services/apis/base.api.service';
import { TranslationPipe } from 'src/app/services/translation.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslationPipe
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];
  searchtext: string = '';
  userForm: FormGroup;
  userRoles: EnumResponse[] = [];
  genders: EnumResponse[] = [];
  languageCode: string;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private baseApiService: BaseApiService,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.userForm = new FormGroup({
      query: new FormControl(''),
    });

    this.baseApiService.getUserRoles().subscribe({
      next: (roles: EnumResponse[]) => {
        this.userRoles = roles;
      },
      error: (error) => {
        console.error('Error:', error);
        return 'Unknown';
      }
    });

    this.baseApiService.getGenders().subscribe({
      next: (genders: EnumResponse[]) => {
        this.genders = genders;
      },
      error: (error) => {
        console.error('Error:', error);
        return 'Unknown';
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers(null);
    this.userForm.get('query')?.valueChanges.subscribe({
      next: (searchText: string) => {
      this.loadUsers(searchText);
    },
      error: (error) => {
        console.error('Error:', error);
    }
    });
  }

  getUserRoleName(id: number): string {
    return this.userRoles.find(role => role.id === id)?.name ?? "Undefined";
  }

  getGenderName(id: number): string {
    return this.genders.find(gender => gender.id === id)?.name?? "Undefined";
  }

  onCreateNewUser() {
    this.dialog.open(CreateUserDialogComponent).afterClosed().subscribe({
      next: () => {
        this.loadUsers(this.userForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onEditUser(userId: string): void {
    this.dialog.open(UpdateUserDialogComponent, {
       data: { userId: userId },
       disableClose: true }
      ).afterClosed().subscribe({
      next: (a) => {
        console.log(a);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onDeleteUser(userId: string): void {
    const deleteUserRequest: DeleteUserRequest = {
      Id: userId,
    };

    this.userService.deleteUser(deleteUserRequest).subscribe(
      {
        next: () => {
          console.log('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }

  loadUsers(searchText?: string | null): void {
    this.userService.getAllUsers().subscribe(
      {
        next: (data) => {
          console.log(data);
          if (searchText) {
            this.onSearch(searchText);
            this.users = this.filteredUsers;
          } else {
            this.users = data;
            this.filteredUsers = data;
          }
        },
        error: (error) => {
          console.error('Error:', error);
        }
      }
    );
  }

  getPhoto(user: UserResponse): string {
    return this.baseApiService.getPhoto(user.photo);
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      (user.firstname && user.firstname.toLowerCase().includes(lowerQuery)) ||
      (user.firstnameRu && user.firstnameRu.toLowerCase().includes(lowerQuery)) ||
      (user.lastname && user.lastname.toLowerCase().includes(lowerQuery)) ||
      (user.lastnameRu && user.lastnameRu.toLowerCase().includes(lowerQuery)) ||
      (user.email && user.email.toLowerCase().includes(lowerQuery)) ||
      (user.phone && user.phone.includes(lowerQuery))
    );
  }

  getTranslatedName(item: UserResponse, name: string): string {
    let key = name;
    if(this.languageCode === "Ru" || this.languageCode === "UzRu"){
      key = key + "Ru";
    }
    return item[key as keyof UserResponse] as string;
  }

  getTranslatedItem(item: UserResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof UserResponse] as string;
  }
}
