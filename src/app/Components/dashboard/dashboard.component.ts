import { Component, OnInit } from '@angular/core';
import { JobsService } from '../../Services/jobs.service';
import { dash } from 'src/app/Interface/dashboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public jobs: any[] = [];
  public dash: dash[] = [];
  public schedule: any = {};

  data = {
    startTime: '',
    endTime: '',
    userId: 0,
  };

  constructor(private JobsService: JobsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchJobs();
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

  fetchDashBoard(): void {
    this.JobsService.getDashBoard().subscribe(
      (data: any) => {
        this.dash = data.map((item: any) => ({
          ...item,
          startTime: this.formatDate(item.startTime),
          endTime: this.formatDate(item.endTime),
          timeOfDay: this.getTimeOfDay(item.startTime, item.endTime),
        }));
        this.filterDashBoard();
        // console.log(this.dash);
      },
      (error) => {
        console.log('Error Fetching DashBoard Users', error);
      }
    );
  }

  //Show True only
  filterDashBoard(): void {
    this.dash = this.dash.filter((item) => {
      return item.isApproved;
    });
  }
  // END

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
  onSubmit() {
    const userId = localStorage.getItem('userId');
    if (userId !== null) {
      this.data.userId = parseInt(userId, 10);
    } else {
      this.router.navigate(['/login']);
    }
    const selectedDate = new Date(this.schedule.date);
    const selectedDateEnd = new Date(this.schedule.date);
    let add = 0;

    // let timeDifference = this.schedule.time;
    //  === 'Morning' ? 9 : 16;
    // i don't understand why it cant take 9 as written
    // instead it takes 7

    if (this.schedule.time === 'Morning') {
      selectedDate.setHours(add + 11);
      selectedDateEnd.setHours(add + 18);
    } else {
      selectedDate.setHours(add + 19);
      selectedDateEnd.setHours(add + 27);
    }

    this.data.startTime = selectedDate.toISOString();
    this.data.endTime = selectedDateEnd.toISOString();

    this.JobsService.addSchedule(this.data).subscribe(
      (response) => {
        console.log('Data sent successfully', response);
        console.log(this.data);

        console.log(
          this.data.startTime,
          ' idk why it gets -2 properties',
          this.data.endTime
        );
        window.location.reload();
        //TODO make message that it successfully submitted and waiting for the boss approve
      },
      (error) => {
        console.log('Error sending data:', error);
      }
    );
  }
}
