import { Injectable } from '@angular/core';
import { Itens } from '../entities/Itens';

@Injectable({
  providedIn: 'root'
})
export class ItensService {
  public listaSerie : Itens[] = [];
  constructor() {
    let i1 :Itens = new Itens("Breaking Bad");
    this.listaSerie.push(i1);

    let i2 :Itens = new Itens("The Mandalorian");
    this.listaSerie.push(i2);

    let i3 :Itens = new Itens("Moon Knight");
    this.listaSerie.push(i3);

  }

  cadastrar(item : Itens){
    this.listaSerie.push(item);
  }

  obterTodos() : Itens[]{
    return this.listaSerie;
  }

  obterPorIndice(indice : number) : Itens{
    return this.listaSerie[indice];
  }

  atualizar(indice : number, novo : Itens){
    this.listaSerie[indice] = novo;
  }

  deletar(indice : number){
    this.listaSerie.splice(indice, 1);
  }
}
