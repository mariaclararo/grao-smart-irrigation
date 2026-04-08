abstract class Usuario{
    private _notificacoes: Notificacao[];
    constructor(public id: number, public nome: string, protected _email: string, protected senha: string){
        this._notificacoes = [];
    };
    get email(): string{ return this._email;}
    set email(email: string){this._email = email;}

    get notificacoes(): Notificacao[]{return this._notificacoes;}
    set notificacoes(listaNotificacao: Notificacao[]){this._notificacoes = listaNotificacao}

    public adicionarNotificacao(notificacao: Notificacao): void {this._notificacoes.push(notificacao);}

    public login(): void{
        //entrar usuario no sistema
        console.log(`Usuário ${this.nome} logado`);
    }
    public logout(): void{
        //sair usuario do sistema
        console.log(`Usuário ${this.nome} deslogado`);
    }
    public abstract exibirMenuPrincipal(): string[]; //permissões de visualização de cada tipo de usuário
}

//usuários podem ser: produtores ou funcionários (herança)
class Produtor extends Usuario{
    constructor(public id: number, public nome: string, protected _email: string, protected senha: string, public cnpj: string, 
                public plano: Plano, private _plantacoes:Plantacao[] = [], private _funcionarios: Funcionario[] = [] ) {
        super(id, nome, _email, senha);
    }

    get funcionarios(): Funcionario[]{return this._funcionarios;}
    get plantacoes(): Plantacao[]{return this._plantacoes;}

    set funcionarios(listaFuncs: Funcionario[]){this._funcionarios = listaFuncs;}
    set plantacoes(listaPlant: Plantacao[]){this._plantacoes = listaPlant;}

    public gerarRelatorioEconomia(Et0: number, kr:number): number {
        let litrosEconomizados = 0;
        this._plantacoes.forEach(plantacao=> {
            plantacao.setores.forEach(setor =>{
                const demandaTeorica = setor.calcularNecessidadeIrrigacao(Et0, 0, kr); //caso n chova nada hoje, min que vai precisar (gasto total, sem economia nenhuma)
                let consumo = 0, temSensor = false;
                //pegar leitura de todos os sensores de fluxo
                setor.dispositivos.forEach(dispositivo =>{
                    const sensoresFluxo = dispositivo.sensores.filter(s => s.tipo == 'Fluxo'); //filtra só os de fluxo
                    if (sensoresFluxo.length > 0){
                        temSensor = true;
                        sensoresFluxo.forEach(sensor =>{consumo += sensor.valorUltimaLeitura});
                    }
                });

                const consumoReal = temSensor ? consumo : demandaTeorica; //se tiver sensor retorna soma dos consumos, se nao, assume-se que consumiu a demanda teórica
                const saldoSetor = demandaTeorica - consumoReal; //economia por setor           
                litrosEconomizados += saldoSetor;
                if (saldoSetor < 0) console.log(`Alerta no Setor ${setor.nome}: Gasto a mais de ${Math.abs(saldoSetor).toFixed(2)}L`);
            });
        });
        if (litrosEconomizados >= 0) console.log(`Volume de água preservado: ${litrosEconomizados.toFixed(2)} Litros`);
        else console.log(`Volume de água gasto além do previsto: ${litrosEconomizados.toFixed(2)} Litros`);
        console.log(`Status do Plano ${this.plano.nome}: ${this.plano.ativo ? 'EM FUNCIONAMENTO' : 'SUSPENSO'}`);
        return litrosEconomizados;
        
    };
    public cadastrarNovoFuncionario(funcionario: Funcionario): void{this._funcionarios.push(funcionario);}
    public associarNovaPlantacao(plantacao: Plantacao): void{this._plantacoes.push(plantacao);}
    public exibirMenuPrincipal(): string[] {
        return ['Gestão Hídrica', 'Monitorar Safra', 'Dados Plano']
    }
}

class Funcionario extends Usuario{
    constructor(public id: number, public nome: string, protected _email: string, protected senha: string, public especialidade: string, public empregador: Produtor) {
        super(id, nome, _email, senha);
    }
    public registrarManutencao(idDisp: number, tipo: string, obs: string): void {
        const data = new Date().toLocaleDateString(); //converte Data em string formatada c/ base no formato local
        const manutencao = `[REGISTRO] ${data} -> Disp. num #${idDisp} ||
                            Tipo: ${tipo} || Func. ${this.nome} - (${this.especialidade}) || Obs: ${obs}`;
        console.log(manutencao);
    };
    public exibirMenuPrincipal(): string[] {
        return ['Monitorar Safra', 'Registrar Manutencao']
    }
}

//produtor - plano associação (produtor assina um plano)
class Plano{
    private _ativo: boolean;
    constructor(public nome: string, public limiteHectares: number, public precoMensal: number, private _situacao: string, public produtorAssinante: Produtor){
        this._ativo = true; //assume que começa o plano pago e ativo
    };
    
    get situacao(): string{return this._situacao;}
    get ativo(): boolean{return this._ativo;}

    set situacao(novaSituacao: string){
        this._situacao = novaSituacao;
        this.atualizarStatus();
    }
    //ativo sem set pois o valor só muda c situacao

    public validarTamanho(areaPlantacao: number): boolean {
        return areaPlantacao <= this.limiteHectares;
    }
    private atualizarStatus(): void{
        if(this._situacao == 'pago' || this._situacao == 'pendente') this._ativo = true;
        else this._ativo = false;
    }
}

//para criar objeto de retorno no método da plantação
interface ResumoSaude{ umidadeMedia: number, alertaDispositivos: Dispositivo[];}

//produtor -plantação agregação (produtor possui plantações)
//plantacao setor composição (no mínimo 1 setor -> plantação inteira)
//mais podem ser add depois
class Plantacao{
    public setores: Setor[] = [];
    constructor(public id: number, public nomeFazenda: string, public localizacao: string, public totalHectares: number, public proprietario: Produtor,
                        idSetor: number, nomeSetor: string, areaHectares: number, espacamentoTubos: number, cultura: Cultura, ){
            this.adicionarSetor(idSetor, nomeSetor, areaHectares, espacamentoTubos, cultura);
        }
    public adicionarSetor(idSet: number, nomeSet: string, area: number, espacamento: number, cult: Cultura): void{
        const newSetor = new Setor(idSet, nomeSet, area, espacamento, this, cult);
        this.setores.push(newSetor);
    }
    public getResumoSaude(): ResumoSaude{
        let umidade = 0, numSetores=0;
        const alertaDispositivos: Dispositivo[] = [];
        this.setores.forEach(setor =>{
            const aux = setor.getUmidadeMedia();
            if(aux != -1){
                umidade += aux;
                numSetores++;
            }
            //verifica se tem dispositivos com bateria baixa para avisar
            setor.dispositivos.forEach(disp=>{
                if(!disp.verificarNivelBateria()) alertaDispositivos.push(disp);
            });
        }); 
        //retorna objeto
        const resumo: ResumoSaude = {
            umidadeMedia: numSetores > 0 ? (umidade / numSetores) : -1,
            alertaDispositivos
        };
        return resumo;
    };
}

//setor - cultura (agregação)
class Setor{
    ;
    constructor(public id: number, public nome: string, public areaHectares: number, public espacamentoTubos: number, public plantacao: Plantacao, 
                public cultura: Cultura, private _dispositivos: Dispositivo[] = []){}

    get dispositivos(): Dispositivo[]{return this._dispositivos;}
    set dispositivos(listaDisp: Dispositivo[]){this._dispositivos = listaDisp;}

    public associarDispositivo(disp: Dispositivo): void{this._dispositivos.push(disp);}
    public getUmidadeMedia(): number{
        let somaUmidade = 0, temSensor = 0;
        this._dispositivos.forEach(disp =>{
            const sensores = disp.sensores.filter(s=> s.tipo == 'Umidade');
            sensores.forEach(sensor=>{
                somaUmidade +=sensor.valorUltimaLeitura;
                temSensor++;
            });
        });

        //se tiver sensor retorna a media das umidades, se não retorna -1 para lidar c erro
        return temSensor > 0 ? (somaUmidade / temSensor) : -1;
    }
    public calcularNecessidadeIrrigacao(Et0: number, precipitacao:number, kr: number): number{
        const LI = (Et0*this.cultura.indiceKc*kr) - precipitacao; //calculo da necessidade de irrigacao
        //se precipitou o suficiente para suprir a demanda hidrica do setor, a necessiade é 0
        const necessidade = LI > 0 ? LI : 0;
        //conversão para padrão de Litros
        const litros = necessidade * this.areaHectares * 10000;
        return litros;
    }
    public possuiAnomaliaTubos(vazaoEsperada: number, tolerancia: number): number{
        let fluxo = 0;
        
        this._dispositivos.forEach(disp=>{
            const sensores = disp.sensores.filter(s=> s.tipo == 'Fluxo');
            sensores.forEach(s => fluxo += s.valorUltimaLeitura); //soma todas as leituras de fluxo
        })

        //nao tem fluxo mas tbm n esperava que tivesse
        if(fluxo == 0 && vazaoEsperada == 0) return 0;

        //nao tem fluxo, mas era para ter -> possível cano entupido (-1)
        if(fluxo == 0 && vazaoEsperada > 0) return -1;

        //calculo de diferenca percentual (pois tubos podem ter capacidades diferentes)
        const difPer = Math.abs(fluxo - vazaoEsperada) / vazaoEsperada;

        if(difPer > tolerancia) return 1; //1 se for maior do que o tolerado, possível vazamento
        else return 0
    }
}

class Cultura{
    private kcOriginal: number; //guarda valor original para os cálculos
    constructor(public nome: string, public variedade: string, public indiceKc: number, public setorPlantado: Setor){
        this.kcOriginal = indiceKc;
    };
    public ajustarKc(tempoPlantioMeses: number): void {
        let proporcao = 1.0;

        if(tempoPlantioMeses < 6) proporcao = 0.85; //planta pequena, "gasta" 85% do Kc base
        else if(tempoPlantioMeses <=18) proporcao = 1.15; //fase de pico de crescimento, "gasta" 115% do Kc base
        else proporcao = 1; //estabiliza e mantém valor base

        this.indiceKc = this.kcOriginal * proporcao
    }
}

//dispositivo - setor (agregacao)
//dispositivo - sensor (agregação)~
class Dispositivo{
    constructor(public id: number, private _macAddress: string, private _nivelBateria: number, public setorDeOperacao: Setor, private _sensores: Sensor[] = []){
        //p validar
        this.macAddress = _macAddress;
        this.nivelBateria = _nivelBateria;
    }

    get macAddress(): string{return this._macAddress;}
    get nivelBateria(): number{return this._nivelBateria;}
    get sensores(): Sensor[] {return this._sensores;}

    set macAddress(ma: string){
        //padroniza em formato corrido de hexa sem os ':' para armazenar no bd dps
        const padrao = ma.replace(/[:.-]/g, "").trim();
        //ve se tem exatamente 12 letras e se são validas para mac
        const isValid = /^[0-9a-fA-F]{12}$/.test(padrao);
        if(isValid) this._macAddress = padrao;
    }
    set nivelBateria(nivel: number){
        if(nivel >= 0 && nivel <= 100) this._nivelBateria = nivel;
    }
    set sensores(listaSensores: Sensor[]){this._sensores = listaSensores;}

    public verificarNivelBateria(): boolean{
        if(this._nivelBateria <= 20){return false;} //indica baixo nível de bateria (valor que eu mesma decidi)
        else return true;
    }
    public prepararPacoteDados(): Leitura[] {
        const pacote: Leitura[] = [];
        //pega a ultima leitura de cada um dos sensores associados para montar o pacote
        this._sensores.forEach(sensor =>{
            const leitura = sensor.leituras.at(-1); //recebe ultima leitura
            //se nao for nula ou undefined
            if(leitura) pacote.push(leitura); //pacote é de leituras, não só do valor (pensar em mudar depois)
        }
        );
        return pacote;
    }
    public adicionarSensor(sensor: Sensor): void{this._sensores.push(sensor);} //set de sensores
}

class Sensor{
    private _valorUltimaLeitura: number;
    private _leituras: Leitura[];
    constructor(public id: number, public tipo: string, public unidadeMedida: string, public dispAssociado: Dispositivo){
        this._valorUltimaLeitura = 0;
        this._leituras = [];
    }; //tipo: 'Umidade' do solo ou 'Fluxo' de água

    get valorUltimaLeitura(): number {return this._valorUltimaLeitura;}
    get leituras(): Leitura[]{return this._leituras;}
    //precisa validar valor antes de atualizar
    public atualizarUltimoValor(leitura: Leitura): void{
        if(this.validarValor(leitura.valor)){
            this._valorUltimaLeitura = leitura.valor;
            this._leituras.push(leitura)
        }
    }
    public validarValor(valor: number): boolean{
        if (valor < 0) return false;
        //validar valor por tipo
        if(this.tipo == 'Umidade') return valor <= 100; //porcentagem entre 0 e 100
        else return this.unidadeMedida == 'GPH' ? valor <= 540 : valor <=2044;
    }

}

class Leitura{
    constructor(public id: number, public valor: number, public timeStamp: Date, public sensorRaiz: Sensor){};
}

class Notificacao{
    usuario:Usuario;
    constructor(public id: number, private _mensagem: string, public lida: boolean, public timeStamp: Date, usuario: Usuario){
        this.usuario = usuario;
    };

    get mensagem(): string {return this._mensagem;}
    set mensagem(msg: string) {if((msg.length) > 0){this._mensagem = msg;}}

    public marcarComoLida(): void {this.lida = true;}
}

//console.log("Compilou")