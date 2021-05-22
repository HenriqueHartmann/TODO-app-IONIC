import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth : AngularFireAuth) { }

  public logged() {
    return this.auth.user;
  }

  public loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider);
  }

  public loginWithFacebook() {
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider);
  }

  public logout() : Observable<any> {
    return from(this.auth.signOut());
  }
}
