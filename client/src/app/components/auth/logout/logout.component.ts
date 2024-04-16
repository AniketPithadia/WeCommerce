import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, IAuth } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
