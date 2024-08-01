import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService, ResetPasswordRequest } from 'src/app/services/apis/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { AskResetCodeComponent } from '../ask-reset-code/ask-reset-code.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;
  languageForm: FormControl = new FormControl();


  constructor(
    private authService: AuthService,
    private helperService: HelperService,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmationCode: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });

    route.queryParams.subscribe({
      next: (params: any) => {
        this.resetPasswordForm.get("email")?.setValue(params.email);
      }
    });
  }
  ngOnInit(): void {
    const languageCode = this.helperService.getLanguageCode();
    this.languageForm.setValue(languageCode);
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      const resetPasswordRequest: ResetPasswordRequest = {
        email: this.resetPasswordForm.get('email')?.value,
        confirmationCode: this.resetPasswordForm.get('confirmationCode')?.value,
        password: this.resetPasswordForm.get('password')?.value,
        confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value
      };
      this.authService.resetPassword(resetPasswordRequest).subscribe({
        next: (data: boolean) => {
          if(data) {
            this.isLoading = false;
            this.helperService.redirectToLoginPage();
          }else{
            this.isLoading = false;
            alert("Password has not been updated!");
            console.log('Confirmation code did not send successfully.');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          alert("Password has not been updated, please try again");
          console.error('Error sending confirmation code:', error);
        }
      });
    }
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.target.value;
    this.helperService.setLaguage(selectedLanguage);
  }
}
