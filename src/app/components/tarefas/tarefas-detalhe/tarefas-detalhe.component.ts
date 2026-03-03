import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { TarefaService } from '../../../services/tarefa.service';

@Component({
    selector: 'app-tarefas-detalhe',
    imports: [FormsModule, MdbFormsModule],
    templateUrl: './tarefas-detalhe.component.html',
    styleUrl: './tarefas-detalhe.component.scss'
})
export class TarefasDetalheComponent {
  @Input() tarefa: Tarefa = new Tarefa();
  @Output() retorno = new EventEmitter<any>();

  router = inject(ActivatedRoute);
  router2 = inject(Router)

  tarefaService = inject(TarefaService);

  constructor() {
    let id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.buscarPorID(id);
    }
  }
  buscarPorID(id: number){
    this.tarefaService.buscarPorId(id).subscribe({
      next: (tarefa) => {
        this.tarefa = tarefa;
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao buscar a tarefa.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  salvar() {
    if(this.tarefa.id > 0){
      this.tarefaService.atualizar(this.tarefa, this.tarefa.id).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          let rota!: string;
          if (this.router2.url.includes('tarefas/a-fazer')) {
            rota = 'principal/tarefas/a-fazer';
          }else if (this.router2.url.includes('tarefas/fazendo')) {
            rota = 'principal/tarefas/fazendo';
          }else if (this.router2.url.includes('tarefas/concluido')) {
            rota = 'principal/tarefas/concluido';
          }else{
            rota = 'principal/tarefas';
          }
          this.retorno.emit(this.tarefa)
          this.router2.navigate([rota]);
        },
        error: (err) => {
          Swal.fire({
            title: 'Erro ao editar a tarefa',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }else{
      this.tarefaService.salvar(this.tarefa).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          let rota!: string;
          if (this.router2.url.includes('tarefas/a-fazer')) {
            rota = 'principal/tarefas/a-fazer';
          }else if (this.router2.url.includes('tarefas/fazendo')) {
            rota = 'principal/tarefas/fazendo';
          }else if (this.router2.url.includes('tarefas/concluido')) {
            rota = 'principal/tarefas/concluido';
          }else{
            rota = 'principal/tarefas';
          }
          this.retorno.emit(this.tarefa)
          this.router2.navigate([rota]);
        },
        error: (err) => {
          Swal.fire({
            title: 'Erro ao criar a tarefa',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
    
  }

  formatarData(data: Date): string {
    if (data == null) {
      return '---';
    }
    return formatDate(data, 'dd/MM/yyyy HH:mm', 'en-US');
  }
}
