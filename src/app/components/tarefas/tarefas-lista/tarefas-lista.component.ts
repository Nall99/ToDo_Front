import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Tarefa } from '../../../models/tarefa';
import { TarefasDetalheComponent } from '../tarefas-detalhe/tarefas-detalhe.component';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Swal from 'sweetalert2';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { Router } from '@angular/router';
import { formatDate, SlicePipe } from '@angular/common';
import { TarefaService } from '../../../services/tarefa.service';

@Component({
    selector: 'app-tarefas-lista',
    imports: [TarefasDetalheComponent, MdbModalModule, MdbDropdownModule, SlicePipe],
    templateUrl: './tarefas-lista.component.html',
    styleUrl: './tarefas-lista.component.scss'
})
export class TarefasListaComponent {
  lista: Tarefa[] = []
  statusLista: string[] = ['A fazer', 'Fazendo', 'Concluído'];
  tarefaEdit: Tarefa = new Tarefa();

  atualDragTarefa!: Tarefa;
  statusPag!: string;

  // Variáveis para drag and drop
  atualStatus: string | null = null;
  posicaoSombra: number | null = null;

  routter = inject(Router);
  modalService = inject(MdbModalService);
  @ViewChild('modalTarefaDetalhe') modalTarefaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  tarefaService = inject(TarefaService);


  constructor(public router: Router) {

    this.buscarTodos();

    if (router.url.includes('tarefas/a-fazer')) {
      this.statusPag = 'A fazer';
    }
    else if (router.url.includes('tarefas/fazendo')) {
      this.statusPag = 'Fazendo';
    }
    else if (router.url.includes('tarefas/concluido')) {
      this.statusPag = 'Concluído';
    }else {
      this.statusPag = 'tarefas';
    }
  }

  buscarTodos(){
    this.tarefaService.buscarTodos().subscribe({
      next: (listaTarefas) => {
        this.lista = listaTarefas;
      },
      error: (err) => {
        Swal.fire({
          title: 'Erro ao carregar a lista de tarefas',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    })
  }

  adicionarTarefa(status: string) {
    this.tarefaEdit = new Tarefa();
    this.tarefaEdit.status = status;
    console.log(this.tarefaEdit);
    this.modalRef = this.modalService.open(this.modalTarefaDetalhe);
  }
  editar(tarefa: Tarefa) {
    this.tarefaEdit = Object.assign({}, tarefa);
    this.modalRef = this.modalService.open(this.modalTarefaDetalhe);
  }
  excluir(tarefa: Tarefa) {
    Swal.fire({
      title: 'Você tem certeza?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tarefaService.deletar(tarefa.id).subscribe({
          next: (mensagem) => {
            Swal.fire({
              title: mensagem,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.buscarTodos();
          },
          error: (err) => {
            Swal.fire({
              title: 'Erro ao excluir a tarefa',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }
  retornoDetalhe(tarefa: Tarefa) {
    let index = this.lista.findIndex(t => t.id == tarefa.id);
    if (index >= 0) {
      tarefa.atualizadoEm = new Date();
      this.lista[index] = tarefa;
    }
    else {
      this.buscarTodos();
    }
    this.modalRef.close();
  }
  onDragStart(tarefa: Tarefa) {
    this.atualDragTarefa = tarefa;
  }
  onDragOver(event: DragEvent, status: string) {
    event.preventDefault();
    this.atualStatus = status;
    this.posicaoSombra = null;
  }
  onDragLeave(status: string) {
      if (this.atualStatus === status) {
          this.atualStatus = null;
          this.posicaoSombra = null;
      }
  }
  onDrop(event: DragEvent, status: string) {
      event.preventDefault();
      this.atualStatus = null;
      this.posicaoSombra = null;
      const index = this.lista.findIndex(t => t.id === this.atualDragTarefa.id);
      if (index !== -1) {
        if ( this.atualDragTarefa.status !== status) {
          this.lista[index].status = status;
          this.atualDragTarefa.status = status;
          const tarefa = this.lista.splice(index, 1)[0];

          tarefa.status = status;
          this.tarefaService.atualizar(tarefa, tarefa.id).subscribe({
              next: (mensagem) => {
                  console.log(mensagem);
              },
              error: (err) => {
                  Swal.fire({
                      title: 'Erro ao atualizar a tarefa',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  });
              }
          });
          this.lista.push(tarefa);
        }
      }

  }
  formatarData(data: Date): string {
      if (data == null) {
        return '---';
      }
      return formatDate(data, 'dd/MM/yyyy HH:mm', 'en-US');
    }
}
