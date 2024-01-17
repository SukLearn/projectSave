import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  token = localStorage.getItem('authToken');

  constructor(private router: Router) {}

  deleteLocalStorage() {
    localStorage.clear();
    // location.reload();
    window.location.reload();
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 500);
  }
}
