import { Component } from '@angular/core';
import { JobsService } from '../../Services/jobs.service';
import { dash } from 'src/app/Interface/dashboard';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  public jobs: any[] = [];
  public users: any[] = [];
  public dash: dash[] = [];
  public schedule: any = {};
  public scheduleId!: number;
  public DeleteScheduleId!: number;
  public jobId!: number;
  public jobTitle!: string;
  data = {
    startTime: '',
    endTime: '',
    userId: 0,
  };

  constructor(private JobsService: JobsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchJobs();
    this.fetchUsers();
    this.fetchDashBoard();
  }

  fetchJobs(): void {
    this.JobsService.getJobs().subscribe(
      (data: any) => {
        this.jobs = data;
        // console.log(this.jobs);
      },
      (error) => {
        console.log('Error fetching Jobs', error);
      }
    );
  }

  fetchUsers(): void {
    this.JobsService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.log('Error fetching Users', error);
      }
    );
  }

  fetchDashBoard(): void {
    this.JobsService.getDashBoard().subscribe(
      (data: any) => {
        this.dash = data.map((item: any) => ({
          ...item,
          startTime: this.formatDate(item.startTime),
          endTime: this.formatDate(item.endTime),
          timeOfDay: this.getTimeOfDay(item.startTime, item.endTime),
        }));
        // this.filterDashBoard();
        // console.log(this.dash);
      },
      (error) => {
        console.log('Error Fetching DashBoard Users', error);
      }
    );
  }

  // Understanding which shift is it
  private getTimeOfDay(startTime: string, endTime: string): string {
    const startHour = new Date(startTime).getHours();
    const endHour = new Date(endTime).getHours();

    if (startHour >= 8 && endHour <= 16) {
      return 'Morning';
    } else {
      return 'Evening';
    }
  }
  // END

  // Changing Date Format
  private formatDate(dateTimeString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
    };
    const formattedDate = new Date(dateTimeString).toISOString().slice(0, 10);
    return formattedDate;
  }
  // END

  // Generating Date
  startDate = new Date(2024, 0, 15);

  endDate = new Date(
    this.startDate.getFullYear(),
    this.startDate.getMonth(),
    this.startDate.getDate() + 6
  );

  currentYear = new Date().getFullYear();
  weekNumber = 1;
  dateRange = this.generateDateRange();
  today: number = Date.now();
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  lastWeek() {
    this.startDate.setDate(this.startDate.getDate() - 7);
    this.endDate.setDate(this.endDate.getDate() - 7);
    this.dateRange = this.generateDateRange();
    this.weekNumber--;
  }

  nextWeek() {
    this.startDate.setDate(this.startDate.getDate() + 7);
    this.endDate.setDate(this.endDate.getDate() + 7);
    this.dateRange = this.generateDateRange();
    this.weekNumber++;
  }
  generateDateRange() {
    let currentDate = new Date(this.startDate);
    const result = [];
    while (currentDate <= this.endDate) {
      result.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }
  //  Generating Date END

  // Matching Table's date and user's date to correctly display
  isMatchingDate(worker: any, date: Date): boolean {
    const workerDate = new Date(worker.startTime);

    return workerDate.toDateString() === date.toDateString();
  }

  // Submitting Workers Schedule

  Approve() {
    if (this.scheduleId) {
      this.JobsService.ApproveSchedule(this.scheduleId).subscribe(
        (response) => {
          console.log('Schedule Id sent successfully', response);

          // window.location.reload();
          //TODO make message that says it successfully sent
        },
        (error) => {
          if (error.status === 404) {
            alert('Invalid Schedule ID. Please Enter a Valid Schedule ID');
          } else {
            console.log('Error Occurred While adding schedule ID:', error);
          }
        }
      );
    } else {
      alert('Please Enter a Valid Schedule ID');
    }
  }
  DeleteSchedule() {
    //  && this.dash[this.scheduleId].isApproved === true
    if (this.DeleteScheduleId) {
      this.JobsService.DeleteSchedule(this.DeleteScheduleId).subscribe(
        (response) => {
          console.log('Schedule Id Deleted successfully', response);
          window.location.reload();
          //TODO make message that says it successfully sent
        },
        (error) => {
          if (error.status === 404) {
            alert('Invalid Schedule ID. Please Enter a Valid Schedule ID');
          } else {
            console.log('Error Deleting schedule ID:', error);
          }
        }
      );
    } else {
      alert('Please Enter a Valid Schedule ID');
    }
  }
  DeleteJob() {
    console.log('DeleteJobId:', this.jobId);

    if (this.jobId) {
      this.JobsService.DeleteJob(this.jobId).subscribe(
        (response) => {
          console.log('Job Deleted successfully', response);
        },
        (error) => {
          if (error.status === 404) {
            alert('If Someone Has a shift This Job Cant be Deleted');
          } else {
            console.log('IDK WHAT DID YOU DO', error);
          }
        }
      );
    } else {
      console.log('DeleteJobId is undefined or not set.');
    }
  }
  addJob() {
    if (this.jobTitle) {
      this.JobsService.AddJob(this.jobTitle).subscribe(
        (response) => {
          console.log('Job Successfully Added', response);
          window.location.reload();
        },
        (error) => {
          if (error.status === 404) {
            alert('test test');
          } else {
            console.log('Error Occurred.', error);
          }
        }
      );
    }
  }
  deleteUser(userId: number) {
    this.JobsService.DeleteUser(userId).subscribe(
      (response) => {
        console.log('User Successfully Deleted', response);
        // window.location.reload();
      },
      (error) => {
        if (error.status === 404) {
          alert('test test');
        } else {
          console.log('Error Occurred.', error);
        }
      }
    );
  }
  public newRoleId: number = 1;
  BecameAdmin(userId: number) {
    this.JobsService.BecomeGod(userId, this.newRoleId).subscribe(
      (response) => {
        console.log('User Role Successfully Changed', response);
      },
      (error) => {
        if (error.status === 404) {
          alert('test');
        } else {
          console.log('Error Occurred:', error);
        }
      }
    );
  }
  // addJob(): void {
  //   this.JobsService.AddJob(this.jobTitle)
  //     .subscribe(
  //       (response) => {
  //         console.log('success', response);
  //       },
  //       (error) => {
  //         console.error('error', error);
  //       }
  //     )
  //     .add(() => console.log('Request completed'));
  // }
}
