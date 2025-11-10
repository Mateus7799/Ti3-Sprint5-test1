import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  AlterarPessoaBody,
  CadastrarPessoaBody,
  PessoaResponse,
  PessoasReqDTO,
} from '../models/pessoa.model';
import { Operacao } from '../models/operacao.model';
import { Servico } from '../models/servico.model';

export type HistoricoPessoaItem = {
  tipo: 'operacao' | 'servico';
  data: Date;
  dados: Operacao | Servico;
};

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  http = inject(HttpClient);
  apiRoute = 'api/pessoa';

  paginaPadrao = 0;
  tamanhoPaginaPadrao = 4;

  buscarPessoas(
    pagina: number = this.paginaPadrao,
    tamPagina: number = this.tamanhoPaginaPadrao,
    query: string = '',
  ): Observable<PessoasReqDTO> {
    return this.http.get<PessoasReqDTO>(
      `${environment.apiURL}/${this.apiRoute}/listar?page=${pagina}&size=${tamPagina}${query.length > 0 ? '&searchTerm=' + query : ''}`,
    );
  }

  cadastrarPessoa(pessoa: CadastrarPessoaBody): Observable<PessoaResponse> {
    return this.http.post<PessoaResponse>(`${environment.apiURL}/${this.apiRoute}`, pessoa);
  }

  editarPessoa(pessoa: AlterarPessoaBody): Observable<PessoaResponse> {
    return this.http.put<PessoaResponse>(
      `${environment.apiURL}/${this.apiRoute}/${pessoa.id}`,
      pessoa,
    );
  }

  buscarHistoricoPessoa(idPessoa: number): Observable<HistoricoPessoaItem[]> {
    return new Observable((observer) => {
      const operacoesPromise = this.http
        .get<any>(`${environment.apiURL}/api/operacao?tipo=0&page=0&size=1000`)
        .toPromise();
      const comprasPromise = this.http
        .get<any>(`${environment.apiURL}/api/operacao?tipo=1&page=0&size=1000`)
        .toPromise();
      const servicosPromise = this.http
        .get<any>(`${environment.apiURL}/api/servico?page=0&size=1000`)
        .toPromise();

      Promise.all([operacoesPromise, comprasPromise, servicosPromise])
        .then(([vendas, compras, servicos]) => {
          const historico: HistoricoPessoaItem[] = [];

          const todasOperacoes = [...vendas.content, ...compras.content];
          todasOperacoes
            .filter((op: Operacao) => op.pessoa.id === idPessoa)
            .forEach((operacao: Operacao) => {
              historico.push({
                tipo: 'operacao',
                data: new Date(operacao.dataHoraTransacao),
                dados: operacao,
              });
            });

          servicos.content
            .filter((srv: Servico) => srv.pessoa.id === idPessoa)
            .forEach((servico: Servico) => {
              historico.push({
                tipo: 'servico',
                data: new Date(servico.dataInicio),
                dados: servico,
              });
            });

          historico.sort((a, b) => b.data.getTime() - a.data.getTime());

          observer.next(historico);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
