import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Project';
  readonly ROOT_URL = 'http://localhost:4200/';

  posts: any;

  constructor(private http: HttpClient) {}

  getPosts() {
    this.posts = this.http.get(this.ROOT_URL + '/posts');
  }
}
