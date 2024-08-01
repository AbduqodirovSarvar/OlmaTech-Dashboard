import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService, LoginRequest } from 'src/app/services/apis/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-ask-reset-code',
  templateUrl: './ask-reset-code.component.html',
  styleUrl: './ask-reset-code.component.scss'
})
export class AskResetCodeComponent {
  forgotPasswordForm: FormGroup;
  isLoading: boolean = false;
  languageForm: FormControl = new FormControl();
  emailSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private authService: AuthService,
    private helperService: HelperService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
  ngOnInit(): void {
    const languageCode = this.helperService.getLanguageCode();
    this.languageForm.setValue(languageCode);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.authService.askConfirmationCode(this.forgotPasswordForm.get('email')?.value).subscribe({
        next: (data: boolean) => {
          if(data) {
            this.isLoading = false;
            this.emailSubject.next(this.forgotPasswordForm.get('email')?.value);
            this.helperService.redirectToResetPassword(this.forgotPasswordForm.get('email')?.value);
          }else{
            this.isLoading = false;
            console.log('Confirmation code did not send successfully.');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
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
