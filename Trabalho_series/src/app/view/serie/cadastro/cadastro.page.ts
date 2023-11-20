import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Alert } from 'src/app/commom/alert';
import { Itens } from 'src/app/model/entities/Itens';
import { AuthService } from 'src/app/model/services/auth.service';
import { FirebaseService } from 'src/app/model/services/firebase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  cadastrar: FormGroup;
  user:any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private auth: AuthService,
    private firebase: FirebaseService,
    private builder: FormBuilder,
    private alert:Alert,

  ) {
    this.user = this.auth.getUsuarioLogado();
    this.cadastrar = new FormGroup({
      nome: new FormControl(''),
      temporadas: new FormControl(''),
      diretor: new FormControl(''),
      lancamento: new FormControl(''),
      genero: new FormControl(''),
      imagem: new FormControl(''),
    });

  }

  ngOnInit() {
    this.cadastrar = this.builder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      temporadas: ['', [Validators.required, Validators.min(1)]],
      diretor: ['', [Validators.required, Validators.minLength(3)]],
      lancamento: ['', [Validators.required, Validators.min(1951), Validators.max(2024)]],
      genero: ['', [Validators.required]],
      imagem: ['', [Validators.required]],
    })
  }

  uploadFile(event: any) {
    const imagem = event.target.files;
  
    if (imagem && imagem.length > 0) {
      this.cadastrar.patchValue({ imagem: imagem });
    }
  }

  

  cadastro() {
    if(this.cadastrar.valid){
      const novo: Itens = new Itens(
        this.cadastrar.value.nome,
      );
      novo.temporadas = this.cadastrar.value.temporadas;
      novo.lancamento = this.cadastrar.value.lancamento;
      novo.genero = this.cadastrar.value.genero;
      novo.diretor = this.cadastrar.value.diretor;
      novo.uid = this.user.uid;
  
      if(this.cadastrar.value.imagem){
        this.firebase.uploadImage(this.cadastrar.value.imagem, novo)?.then(() =>{
          this.router.navigate(['/home']);
        });
      }else{
        this.firebase.cadastrar(novo).then(() => this.router.navigate(['/home'])).catch((error) => {
          console.log(error);
          this.alert.presentAlert('Erro', 'Erro ao salvar as Itenses!');
        });
      }
    }else{
      this.alert.presentAlert('Erro!', 'Todos os campos são obrigatórios!');
    }
  }
  async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Lista de Séries',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

