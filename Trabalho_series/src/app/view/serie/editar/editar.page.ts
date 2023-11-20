import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Itens } from 'src/app/model/entities/Itens';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  nome! : string;
  lancamento! : number;
  temporadas! : number;
  diretor! : string;
  genero! : number;
  imagem! : any;
  itens! : Itens;
  edicao: boolean = true;
  user : any;

  constructor(private firebase : FirebaseService,
     private router : Router,
      private alertController: AlertController,
      private auth : AuthService) {
      this.user = this.auth.getUsuarioLogado();
  }

  ngOnInit() {
    this.itens = history.state.itens;
    this.nome = this.itens.nome;
    this.lancamento = this.itens.lancamento;
    this.diretor = this.itens.diretor;
    this.temporadas = this.itens.temporadas;
    this.genero = this.itens.genero;


  }

  habilitar(){
    if (this.edicao){
      this.edicao = false;
    }else {
      this.edicao = true;
    }
  }
  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }

  editar(){
    if (this.nome) {
      let novo: Itens = new Itens(this.nome);
  
      // Check if all mandatory fields are present and meet additional conditions
      if (this.diretor && this.genero) {
        if (this.lancamento && this.lancamento > 1500) {
          if (this.temporadas && this.temporadas > 0) {
            novo.lancamento = this.lancamento;
            novo.diretor = this.diretor;
            novo.temporadas = this.temporadas;
            novo.genero = this.genero;
            novo.id = this.itens.id;
            novo.uid = this.user.uid;
  
            if (this.imagem) {
              this.firebase.uploadImage(this.imagem, novo)
                ?.then(() => {
                  this.router.navigate(["/home"]);
                })
                .catch((error) => {
                  console.log(error);
                  this.presentAlert("Erro", "Erro ao Atualizar Série!");
                });
            } else {
              novo.downloadURL = this.itens.downloadURL;
              this.firebase.editar(novo, this.itens.id)
                .then(() => {
                  this.router.navigate(["/home"]);
                })
                .catch((error) => {
                  console.log(error);
                  this.presentAlert("Erro", "Erro ao Atualizar Série!");
                });
            }
          } else {
            this.presentAlert("Erro", "A quantidade de temporadas é inválida. Deve conter pelo menos uma temporada.");
          }
        } else {
          this.presentAlert("Erro", "A data de estreia é inválida. Deve ser maior que 1951 e menor que 2024.");
        }
      } else {
        this.presentAlert("Erro", "Todos os campos são obrigatórios!");
      }
    } else {
      this.presentAlert("Erro", "Nome é um campo Obrigatório!");
    }
  }



  excluir(){
    this.presentConfirmAlert("ATENÇÃO", "Deseja realmente excluir a Série?")
  }

  excluiritens(){
    this.firebase.excluir(this.itens.id)
    .then(() => {this.router.navigate(["/home"]);})
    .catch((error) =>{
      console.log(error);
      this.presentAlert("Erro","Erro ao excluir série!")
    })
  }

  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Series',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentConfirmAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Series',
      subHeader: subHeader,
      message: message,
      buttons: [
        {text: 'Cancelar', role: 'cancelar', handler: ()=>{console.log("cancelou")}},
        {text: 'Confirmar', role: 'confirmar', handler: (acao)=>{this.excluiritens()}},
      ],
    });
    await alert.present();
  }

}
