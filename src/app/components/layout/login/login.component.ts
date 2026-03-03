import { LoginService } from './../../../auth/login.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Login } from '../../../auth/login';

@Component({
    selector: 'app-login',
    imports: [MdbFormsModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  login: Login = new Login();



  router = inject(Router)
  LoginService = inject(LoginService)


  logar() {
    this.LoginService.logar(this.login).subscribe({
      next: token => {
        if(token){
          this.LoginService.addToken(token)
          this.router.navigate(['/principal/tarefas'])
        }else{
          alert('usuario ou senha estão incorretos');
        }
      },
      error: error => {
        alert('Deu erro');
      }
    });
  }
}
