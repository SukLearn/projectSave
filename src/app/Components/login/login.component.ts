import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobsService } from '../../Services/jobs.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userData = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private JobsService: JobsService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  Submit() {
    this.userData.email = this.loginForm.get('email')?.value;
    this.userData.password = this.loginForm.get('password')?.value;

    this.JobsService.loginUser(this.userData).subscribe(
      (result: string) => {
        const token = result;
        localStorage.setItem('authToken', token);
        console.log(`Login was successful`);

        // console.log(this.userData);
        // console.log('received token is ', token);
        // let b = atob(token.split('.')[1]);

        // let helper = new JwtHelperService();
        // const decodedToken = helper.decodeToken(token);
        // console.log(decodedToken);

        if (token) {
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        } else {
          // this.router.navigate(['/error']);
        }
      },
      (error) => {
        console.error('Login error', error);
        console.log('Error status:', error.status);
      }
    );
  }
}
