import { Component, OnInit } from '@angular/core';
import { JobsService } from '../../Services/jobs.service';
import { dash } from 'src/app/Interface/dashboard';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public jobs: any[] = [];
  public users: any[] = [];
  public dash: dash[] = [];

  constructor(private JobsService: JobsService) {}
  ngOnInit(): void {
    this.fetchJobs();
    this.fetchUsers();
    this.fetchDashBoard();
  }
  fetchJobs(): void {
    this.JobsService.getJobs().subscribe(
      (data: any) => {
        this.jobs = data;
        console.log(this.jobs);
        // WORKS
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
        // console.log(this.users);
        // WORKS
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
        this.filterDashBoard();

        console.log(this.dash);
        // WORKS
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
  // private formatDate(dateTimeString: string): string {
  //   const options: Intl.DateTimeFormatOptions = {
  //     month: 'numeric',
  //     day: 'numeric',
  //     hour: 'numeric',
  //   };
  //   const formattedDate = new Date(dateTimeString).toLocaleString(
  //     undefined,
  //     options
  //   );
  //   return formattedDate;
  // }
  // END
  private formatDate(dateTimeString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
    };

    // Use moment to parse the date string
    const parsedDate = moment(
      dateTimeString,
      'YYYY-MM-DDTHH:mm:ss.SSS'
    ).toDate();

    const formattedDate = parsedDate.toLocaleString(undefined, options);
    return formattedDate;
  }

  months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // console.log(this.dash[0].startTime);
  test() {
    const ricxvebi = [];
    for (let i = 0; i < this.dash.length; i++) {
      const parts = this.dash[i].startTime.split('.');
      const days = parseInt(parts[0]);
      const givenMonths = parseInt(parts[1]) - 1;

      var wavida = days % 7;
      if (wavida % 7 == 0) {
        wavida = 7;
      }
      console.log(wavida);
    }
  }

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
    this.test();
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
  isMatchingDate(worker: any, date: Date): boolean {
    const workerDate = new Date(worker.startTime);
    console.log(workerDate);

    return workerDate.toDateString() === date.toDateString();
  }
  //  Generating Date END
}
