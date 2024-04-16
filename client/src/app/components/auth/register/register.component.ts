import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService, IAuth } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  authToken: IAuth = { token: '' };
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {}

  //if more than one validators use array
  registerForm = new FormGroup({
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, Validators.required),
  });
  onSubmit() {
    this.authService
      .register(
        this.registerForm.value.email!,
        this.registerForm.value.password!
      )
      .subscribe({
        next: (token) => {
          this.openSnackBar('Login Successful');

          this.router.navigateByUrl('/home');
        },
        error: (e) => {
          console.log(e.error.errors);
          this.errorMessage = e.error.errors;
          this.openSnackBar('All Fields are required');
        },
        complete: () => {
          console.info('complete');
        },
      });
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
