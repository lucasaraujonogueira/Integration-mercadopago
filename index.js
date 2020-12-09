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
        let date = {
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
             let pagamento = await MercadoPago.preferences.create(date);
             console.log(pagamento);
             return res.redirect(pagamento.body.init_point);
       } catch (error) {
          console.log(error.message)
       }
       
})


// Rota de notificação 
app.post("/not",(req, res) => {
    // Parametros dinamicos da URL
    let id = req.query.id;

    // Consultando no banco de dados do mercado pago se o pagamento existe
    setTimeout(() => {
        // Filtrando o pagamento pelo ID
        let filtro = {
            "order.id": id
        }
        // Realizando a busca
        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            // tRAZENDO O PAGAMENTO
            let pagamento = data.body.results[0];
            // VERIFICANDO SE O PAGAMENTO EXISTE
            if(pagamento != undefined){
                console.log(pagamento)
            }
            else{
                console.log("Pagamento não existe")
            }
        })
        .catch(error =>  {
            console.log(error)
        })
    }, 20000)

    res.send("ok");
})

app.listen(80, (req, res, err)=> {
    console.log("Servidor Rodando com sucesso");
    if(err) console.log("Houve um erro");
})