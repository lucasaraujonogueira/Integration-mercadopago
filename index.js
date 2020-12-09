const express = require('express');
// Biblioteca do Mercado Pago
const MercadoPago = require('mercadopago');
const app = express();

//Configurações
MercadoPago.configure({
    sendbox: true,
    // TOKEN DE ACESSO
     access_token: "TEST-1571157587601695-113023-81dc2e4a3ccb008731fc1f61593f4bd5-375935951"
})

app.get('/',(req, res)=> {
    console.log("Olá pessoal");
    res.json("Olá mundo, nossa aplicação está rodando");
})

// Rota de Pagamento
app.get('/pagar',async (req, res) => {
    // PRECO AVALIADO EM QUANTIDADE  =  QUANTIDADE =  REQ.BODY.QUANTIDADE
  
    let email_pagador = "josephavelino@hotmail.com";
    let id = "" + Date.now(); // UTILIZANDO NO FORMATO DATA E CONVERTENDO EM STRING 

    // Fazendo venda generica 
        // Criando um OBJ JSON DEFINANDO PAGAMENTOS
        let dados = {
            items: [
                item = {
                    // ID PRA SABER SE O PAGAMENTO FOI FEITO OU NÃO
                    // pesquisar sobre UUID NODEJS(ID numero ÚNICO)
                    id: id,
                    title: "2 camisas, 1 video game",
                    quantity: 1,
                    currency_id: "BRL",
                    //preco em fload
                    unit_price: parseFloat(150),
                }
            ],
            //PAGADOR 
            payer: {
                //Posso pegar o e-mail do banco de dados
                email: email_pagador
            },
            //Metodo de consulta quando mercado pagado informa que o pagamento foi concluído
            external_reference: id
        }

       
        try {
            var pagamento = await MercadoPago.preferences.create(dados);
            return res.redirect(pagamento.body.init_point);
        } catch (error) {
            return res.send(error.message);
        }
       
           

})


// Rota de notificação 
app.post("/not",(req, res) => {
    // Parametros dinamicos da URL
    console.log(req.query)
    res.send("ok");
})

app.listen(80, (req, res, err)=> {
    console.log("Servidor Rodando com sucesso");
    if(err) console.log("Houve um erro");
})