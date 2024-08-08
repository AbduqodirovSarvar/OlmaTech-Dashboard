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
import { DeleteTeamRequest, TeamResponse, TeamService } from 'src/app/services/apis/team.service';
import { CreateTeamDialogComponent } from './create-team-dialog/create-team-dialog.component';
import { UpdateTeamDialogComponent } from './update-team-dialog/update-team-dialog.component';
import { TranslationPipe } from 'src/app/services/translation.pipe';
import { BaseApiService } from 'src/app/services/apis/base.api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-team',
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
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  members: TeamResponse[] = [];
  filteredMembers: TeamResponse[] = [];
  searchtext: string = '';
  teamForm: FormGroup;
  languageCode: string;

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
    private baseApiService: BaseApiService,
    private helperService: HelperService
  ) {
    this.languageCode = this.helperService.getLanguageCode();
    this.teamForm = new FormGroup({
      query: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loadTeamMembers(null);
    this.teamForm.get('query')?.valueChanges.subscribe(searchText => {
      this.loadTeamMembers(searchText);
    });
  }

  onCreateNewMember() {
    this.dialog.open(CreateTeamDialogComponent).afterClosed().subscribe({
      next: () => {
        this.loadTeamMembers(this.teamForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  onEditMember(memberId: string): void {
    this.dialog.open(UpdateTeamDialogComponent, { data: { memberId: memberId } }).afterClosed().subscribe({
      next: () => {
        this.loadTeamMembers();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deleteMember(memberId: string): void {
    const deleteMemberRequest: DeleteTeamRequest = {
      Id: memberId,
    };

    this.teamService.deleteTeamMember(deleteMemberRequest).subscribe({
      next: () => {
        this.loadTeamMembers(this.teamForm.get('query')?.value);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  loadTeamMembers(searchText?: string | null): void {
    this.teamService.getAllTeamMembers().subscribe({
      next: (data) => {
        if (searchText) {
          this.onSearch(searchText);
          this.members = this.filteredMembers;
        } else {
          this.members = data;
          this.filteredMembers = data;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  getPhoto(member: TeamResponse): string {
    return this.baseApiService.getPhoto(member.photo);
  }

  onSearch(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      (member.firstname && member.firstname.toLowerCase().includes(lowerQuery)) ||
      (member.firstnameRu && member.firstnameRu.toLowerCase().includes(lowerQuery)) ||
      (member.lastname && member.lastname.toLowerCase().includes(lowerQuery)) ||
      (member.lastnameRu && member.lastnameRu.toLowerCase().includes(lowerQuery)) ||
      (member.positionUz && member.positionUz.toLowerCase().includes(lowerQuery)) ||
      (member.positionEn && member.positionEn.toLowerCase().includes(lowerQuery)) ||
      (member.positionRu && member.positionRu.toLowerCase().includes(lowerQuery)) ||
      (member.positionUzRu && member.positionUzRu.toLowerCase().includes(lowerQuery))
    );
  }

  getTranslatedName(item: TeamResponse, name: string): string {
    let key = name;
    if(this.languageCode === "Ru" || this.languageCode === "UzRu"){
      key = key + "Ru";
    }
    return item[key as keyof TeamResponse] as string;
  }

  getTranslatedItem(item: TeamResponse, name: string): string {
    const key = name + this.languageCode;
    return item[key as keyof TeamResponse] as string;
  }
}
