class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados (){
        for (let i in this){
            //console.log(i, this[i]) //[i] serve para acessar atributos do array, assim como this.
            if (this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

/*  -- Recebendo informaçoes --    */

class Bd {
     
    constructor(){
        let id = localStorage.getItem('id')

        if (id === null){
            localStorage.setItem('id', 0)
        } 
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')  
        return parseInt(proximoId) + 1
    }

    gravar (d){
       
       let id = this.getProximoId()

       localStorage.setItem(id, JSON.stringify(d))

       localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()

       let id = localStorage.getItem('id')

       //Recuperando todas despesas. Fizemos uma estrutura de repetiçao para recuperar os dados, utilizando as keys do navegador (que sao sequenciais ate ID, que representa o atual)
       for (let i = 1; i<= id; i++) {

       //recuperando despesa
       let despesa = JSON.parse(localStorage.getItem(i))

        // existe possibilidade de haver indices que foram removidos
        //nesses casos, vamos pular
        if(despesa === null) {
            continue
        }

        despesa.id = i
        despesas.push(despesa)

       }

        return (despesas)
    }

    pesquisar(despesa) {
        
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()


        //console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
            console.log('ANO')
    }

        // mes 
        if(despesa.mes != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
           console.log('MES')
        }   
        
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
            console.log('DIA')
        }

        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
            //console.log('TIPO')
        }    
        
        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
            console.log('VALOR')
        }

        return despesasFiltradas
    }

        remover(id){
            localStorage.removeItem(id)
        }
}

    let bd = new Bd()

    function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)
    if (despesa.validarDados()){

        bd.gravar(despesa) 
    
        document.getElementById('modal_titulo').innerHTML = 'Registro realizado com sucesso!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa realizada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
    
    //dialog de sucesso
    $('#modalRegistraDespesa').modal('show')
        ano.value = '' 
        mes.value = ''  
        dia.value = ''  
        tipo.value= ''  
        descricao.value = '' 
        valor.value = '' 


} else {
       
        document.getElementById('modal_titulo').innerHTML = 'Erro no preenchimento das informações'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
        document.getElementById('modal_btn').innerHTML = 'voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
    
    //dialog de erro
    $('#modalRegistraDespesa').modal('show')
    
    }
}

function carregaListaDespesa(despesas = Array()) {


    if(despesas.length == 0){
    despesas = bd.recuperarTodosRegistros()
    }

   let listaDespesas =  document.getElementById('listaDespesas')

   //limpando o inner
   listaDespesas.innerHTML = ''

   //Percorrer o array despesas, listando de forma dinamica
   despesas.forEach(function(d){
    
    //console.log(d)
    // criando a linha tr
    let linha = listaDespesas.insertRow()

     // criando as colunas td
     linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`  
     
     //ajustar o tipo usando switch (considerar o tipo, se for string, utilizar o comando parse)
     switch(d.tipo) {

        case '1': d.tipo = 'Alimentação'
            break
        case '2': d.tipo = 'Educação'
            break
        case '3': d.tipo = 'Lazer'
            break
        case '4': d.tipo = 'Saúde'
            break
        case '5': d.tipo = 'Transporte'   
            break
     }
     linha.insertCell(1).innerHTML = d.tipo
     linha.insertCell(2).innerHTML = d.descricao
     linha.insertCell(3).innerHTML = d.valor

     //Criar botao de excluir
        
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger' //cor vermelha usando bootstrap
        btn.innerHTML = '<i class="fas fa-times"></i>'//modelo do botao
        btn.id = `id_despesa_${d.id}` 

        btn.onclick = function(){   
            
            //remover despesa}
            
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)

            window.location.reload()

        }

        linha.insertCell(4).append(btn)

   })
}

function pesquisarDespesa() {
    
    
    let ano =  document.getElementById('ano').value
    let mes =  document.getElementById('mes').value
    let dia =  document.getElementById('dia').value
    let tipo =  document.getElementById('tipo').value
    let descricao =  document.getElementById('descricao').value
    let valor =  document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
   
    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesa(despesas)

   
}

    


     



