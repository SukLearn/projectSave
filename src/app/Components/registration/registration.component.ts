import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { matchPassword } from '../../Services/customValidation/matchpassword.validator';
import { JobsService } from '../../Services/jobs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    jobId: '',
  };
  reactiveForm: FormGroup;
  public jobs: any[] = [];
  constructor(private JobsService: JobsService, private router: Router) {
    this.reactiveForm = new FormGroup(
      {
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        jobId: new FormControl(null, [Validators.required]),
      },
      {
        validators: matchPassword,
      }
    );
  }
  ngOnInit(): void {
    this.fetchJobs();
  }
  fetchJobs(): void {
    this.JobsService.getJobs().subscribe(
      (data: any) => {
        this.jobs = data;
        // console.log(this.jobs);
        // WORKS;
      },
      (error) => {
        console.log('Error fetching Jobs', error);
      }
    );
  }

  Submitted() {
    this.userData.firstName = this.reactiveForm.get('firstName')?.value;
    this.userData.lastName = this.reactiveForm.get('lastName')?.value;
    this.userData.email = this.reactiveForm.get('email')?.value;
    this.userData.password = this.reactiveForm.get('password')?.value;
    this.userData.jobId = this.reactiveForm.get('jobId')?.value;
    this.JobsService.registerUser(this.userData).subscribe(
      (result) => {
        console.log('user registered successfully ', result);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('error occurred during registration ', error);
      }
    );
  }
}
