import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { AuthService, LoginRequest } from 'src/app/services/apis/auth.service';
import { UserResponse } from 'src/app/services/apis/user.service';
import { HelperService } from 'src/app/services/helper.service';

export interface LoginCommand {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  languageForm: FormControl = new FormControl();

  constructor(
    private authService: AuthService,
    private helperService: HelperService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    const languageCode = this.helperService.getLanguageCode();
    this.languageForm.setValue(languageCode);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginCommand: LoginRequest = this.loginForm.value;
      console.log(loginCommand);
      this.authService.login(loginCommand).subscribe({
        next: (data) => {
          this.isLoading = false;
          console.log(data);
          this.helperService.setAccessToken(data.accessToken);
          this.helperService.redirectToDashboard();
        },
        error: (error) => {
          console.log(error.message);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.target.value;
    this.helperService.setLaguage(selectedLanguage);
  }
}
