export class Itens {
    private _id! : string;
    private _nome : string;
    private _lancamento! : number;
    private _diretor! : string;
    private _temporadas! : number;
    private _genero! : number;
    private _downloadURL: any;
    private _uid!: string;

    constructor(nome : string){
        this._nome = nome;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get nome() : string {
        return this._nome;
    }

    public set nome(nome: string){
        this._nome = nome;
    }


    public get lancamento() : number {
        return this._lancamento;
    }

    public set lancamento(lancamento: number){
        this._lancamento = lancamento;
    }

    public get temporadas() : number {
        return this._temporadas;
    }

    public set temporadas(temporadas: number){
        this._temporadas = temporadas;
    }

    
    public get diretor() : string {
        return this._diretor;
    }

    public set diretor(diretor: string){
        this._diretor = diretor;
    }
    

    public get genero() : number {
        return this._genero;
    }

    public set genero(value: number){
        this._genero = value;
    }

    public get downloadURL(): any {
        return this._downloadURL;
    }
    public set downloadURL(value: any) {
        this._downloadURL = value;
    }
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
}