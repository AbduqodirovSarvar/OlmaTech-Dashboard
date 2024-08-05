import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AboutService, UpdateAboutRequest, AboutResponse } from 'src/app/services/apis/about.service';
import { TranslationPipe } from "../../../services/translation.pipe";

@Component({
  selector: 'app-update-about-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    TranslationPipe
],
  templateUrl: './update-about-dialog.component.html',
  styleUrls: ['./update-about-dialog.component.scss']
})
export class UpdateAboutDialogComponent implements OnInit {
  aboutForm!: FormGroup;
  selectedFileName: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UpdateAboutDialogComponent>,
    private aboutService: AboutService,
    @Inject(MAT_DIALOG_DATA) public data: { aboutId: string }
  ) {}

  ngOnInit(): void {
    this.aboutForm = new FormGroup({
      Id: new FormControl('', Validators.required),
      AddressUz: new FormControl(''),
      AddressEn: new FormControl(''),
      AddressRu: new FormControl(''),
      AddressUzRu: new FormControl(''),
      TitleUz: new FormControl(''),
      TitleEn: new FormControl(''),
      TitleRu: new FormControl(''),
      TitleUzRu: new FormControl(''),
      DescriptionUz: new FormControl(''),
      DescriptionEn: new FormControl(''),
      DescriptionRu: new FormControl(''),
      DescriptionUzRu: new FormControl(''),
      DescriptionFooterUz: new FormControl(''),
      DescriptionFooterEn: new FormControl(''),
      DescriptionFooterRu: new FormControl(''),
      DescriptionFooterUzRu: new FormControl(''),
      Experience: new FormControl(''),
      Photo: new FormControl<File | null>(null)
    });

    this.aboutService.getAbout(this.data.aboutId).subscribe({
      next: (about: AboutResponse) => {
        if (about) {
          this.aboutForm.patchValue({
            Id: about.id,
            AddressUz: about.addressUz,
            AddressEn: about.addressEn,
            AddressRu: about.addressRu,
            AddressUzRu: about.addressUzRu,
            TitleUz: about.titleUz,
            TitleEn: about.titleEn,
            TitleRu: about.titleRu,
            TitleUzRu: about.titleUzRu,
            DescriptionUz: about.descriptionUz,
            DescriptionEn: about.descriptionEn,
            DescriptionRu: about.descriptionRu,
            DescriptionUzRu: about.descriptionUzRu,
            DescriptionFooterUz: about.descriptionFooterUz,
            DescriptionFooterEn: about.descriptionFooterEn,
            DescriptionFooterRu: about.descriptionFooterRu,
            DescriptionFooterUzRu: about.descriptionFooterUzRu,
            Experience: about.experience
          });
        }
      },
      error: (error) => {
        console.error('Error fetching about data:', error);
      }
    });
  }

  updateAboutRequest: UpdateAboutRequest = {
    Id: '',
    AddressUz: '',
    AddressEn: '',
    AddressRu: '',
    AddressUzRu: '',
    TitleUz: '',
    TitleEn: '',
    TitleRu: '',
    TitleUzRu: '',
    DescriptionUz: '',
    DescriptionEn: '',
    DescriptionRu: '',
    DescriptionUzRu: '',
    DescriptionFooterUz: '',
    DescriptionFooterEn: '',
    DescriptionFooterRu: '',
    DescriptionFooterUzRu: '',
    Experience: 0,
    Photo: new File([], '')
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.aboutForm.valid) {
      this.updateAboutRequest = {
        Id: this.aboutForm.get('Id')?.value,
        AddressUz: this.aboutForm.get('AddressUz')?.value,
        AddressEn: this.aboutForm.get('AddressEn')?.value,
        AddressRu: this.aboutForm.get('AddressRu')?.value,
        AddressUzRu: this.aboutForm.get('AddressUzRu')?.value,
        TitleUz: this.aboutForm.get('TitleUz')?.value,
        TitleEn: this.aboutForm.get('TitleEn')?.value,
        TitleRu: this.aboutForm.get('TitleRu')?.value,
        TitleUzRu: this.aboutForm.get('TitleUzRu')?.value,
        DescriptionUz: this.aboutForm.get('DescriptionUz')?.value,
        DescriptionEn: this.aboutForm.get('DescriptionEn')?.value,
        DescriptionRu: this.aboutForm.get('DescriptionRu')?.value,
        DescriptionUzRu: this.aboutForm.get('DescriptionUzRu')?.value,
        DescriptionFooterUz: this.aboutForm.get('DescriptionFooterUz')?.value,
        DescriptionFooterEn: this.aboutForm.get('DescriptionFooterEn')?.value,
        DescriptionFooterRu: this.aboutForm.get('DescriptionFooterRu')?.value,
        DescriptionFooterUzRu: this.aboutForm.get('DescriptionFooterUzRu')?.value,
        Experience: this.aboutForm.get('Experience')?.value,
        Photo: this.aboutForm.get('Photo')?.value
      };

      console.log(this.updateAboutRequest);

      this.aboutService.updateAbout(this.updateAboutRequest).subscribe({
        next: () => {
          console.log('About updated successfully!');
        },
        error: (error) => {
          console.error('Error updating about:', error);
        },
        complete: () => {
          this.dialogRef.close();
        }
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.aboutForm.patchValue({ Photo: file });
      this.selectedFileName = file.name;
    }
  }
}
