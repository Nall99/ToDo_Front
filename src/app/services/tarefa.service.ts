import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  http = inject(HttpClient);

  API = 'http://localhost:8080/api/tarefas';

  constructor() { }

  buscarTodos(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.API+'/buscarTodos');
  }
  buscarPorId(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(this.API+'/buscarPorId/'+id);
  }
  salvar(tarefa: Tarefa): Observable<string> {
    return this.http.post<string>(this.API+'/salvar', tarefa, {responseType: 'text' as 'json'});
  }
  atualizar(tarefa: Tarefa, id: number): Observable<string> {
    return this.http.put<string>(this.API+'/atualizar/'+id, tarefa, {responseType: 'text' as 'json'});
  }
  deletar(id: number): Observable<string> {
    return this.http.delete<string>(this.API+'/deletar/'+id, {responseType: 'text' as 'json'});
  }
}
