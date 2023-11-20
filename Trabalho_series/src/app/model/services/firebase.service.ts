import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Itens } from '../entities/Itens';
import { AngularFireStorage} from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string ="series";
  user : any;

  constructor(private firestore : AngularFirestore,
    @Inject(Injector) private readonly injector: Injector,
    private storage : AngularFireStorage) { }

    private injectAuthService(){
      return this.injector.get(AuthService);
    }

  buscarTodos(){
    this.user = this.injectAuthService().getUsuarioLogado();
    return this.firestore.collection(this.PATH,
       ref => ref.where('uid','==', this.user.uid)).snapshotChanges();
  }
  cadastrar(itens:Itens){
    return this.firestore.collection(this.PATH)
    .add({nome : itens.nome,
      lancamento: itens.lancamento,
      diretor: itens.diretor,
      temporadas: itens.temporadas,
      genero: itens.genero,
      downloadURL: itens.downloadURL,
      uid : itens.uid});
  }
  editar(itens : Itens, id:string){
    return this.firestore.collection(this.PATH).doc(id)
    .update({nome : itens.nome,
      lancamento: itens.lancamento,
      diretor: itens.diretor,
      temporadas: itens.temporadas,
      genero: itens.genero,
      downloadURL: itens.downloadURL,
      uid : itens.uid});
  }
  excluir(id : string){
    return this.firestore.collection(this.PATH).doc(id)
    .delete();
  }
  uploadImage(imagem:any, itens:Itens){
    const file = imagem.item(0);
    if(file.type.split('/')[0] !== 'image'){
      console.error("tipo Não suportado");
      return;
    }
    const path = `images/${itens.nome}_${file.name}`;
    const fileRef = this.storage.ref(path);
    let task = this.storage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadFileURL = fileRef.getDownloadURL();
        uploadFileURL.subscribe(resp => {
          itens.downloadURL = resp;
          if(!itens.id){
            this.cadastrar(itens);
          }else{
            this.editar(itens, itens.id);
          }
        })
      })
    ).subscribe();
    return task;
  }
}
