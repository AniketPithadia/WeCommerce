import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface IAuth {
  token: string;
}

export interface ITodo {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private myToken = '';
  private url: string = 'http://localhost:8000/api/login';
  private urlRegister: string = 'http://localhost:8000/api/register';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<IAuth> {
    return this.http
      .post<IAuth>(this.url, {
        email: email,
        password: password,
      })
      .pipe(
        tap((response: any) => {
          this.myToken = response.token;
          this._isLoggedIn$.next(true);

          localStorage.setItem('authToken', response.token);
        })
      );
  }
  checkLogin(): Observable<boolean> {
    if (localStorage.getItem('authToken')) {
      this._isLoggedIn$.next(true);
      return this.isLoggedIn$;
    } else {
      this._isLoggedIn$.next(false);
      return this.isLoggedIn$;
    }
  }
  logout() {
    this._isLoggedIn$.next(false);
    this.myToken = '';

    localStorage.removeItem('authToken');
  }

  register(email: string, password: string): Observable<IAuth> {
    return this.http
      .post<IAuth>(this.urlRegister, {
        email: email,
        password: password,
      })
      .pipe(
        tap((response: any) => {
          this._isLoggedIn$.next(true);
          this.myToken = response.token;

          localStorage.setItem('authToken', response.token);
        })
      );
  }

  getTodos() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('authToken')!,
      }),
    };
    return this.http.get<ITodo>('http://localhost:5000/api/todos', httpOptions);
  }
}
