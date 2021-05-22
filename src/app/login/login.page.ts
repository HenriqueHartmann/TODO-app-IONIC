import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService : AuthService,
              public router : Router) {
    this.authService.logged().subscribe(
      data => {
        if (data != null) {
          this.router.navigate(['home']);
        }
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
  }

}
