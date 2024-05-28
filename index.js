const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
var router = require("./routes/routes")


/* var database = require("./database/database")
 */
const connection = require("./database/database")
const UserController = require("./user/UserController")
const InstrutorController = require("./instrutor/InstrutorController")
const CursoController = require("./curso/CursoController")





// view engine (para utilizar o ejs)

app.set("view engine", "ejs")

//body parser (acessar formularios)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



//static(para usar arquivos estaticos fts, css)
app.use(express.static("public"))


//database connection

app.use(session({
    secret: "fofinho", cookie: {maxAge: 100000000}
}))



app.use("/", UserController)
app.use("/", InstrutorController)
app.use("/", CursoController)
app.use("/", router);

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const jQuery = require('jquery');

// Simule um ambiente de navegador carregando um documento HTML
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>jQuery with Node.js</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <div id="content">This is some content</div>
</body>
</html>
`);

// Use jQuery no ambiente jsdom
const $ = jQuery(dom.window);



app.get("/" , (req,res) =>{
    req.session.user = {
        id: 1,
        emai: "vivicogamerbr2@gmail.com",
        nome: "Gaiz lindoo"
    }
    const sessao = req.session.user
    var sessao1
    if(sessao == undefined){
        sessao1 = 0 
        res.render("home.ejs", {sessao1:sessao1})

    }else if(sessao != undefined){
        const nomeUsuarioSession = req.session.user.nome
       
        sessao1 = 1
        res.render("home.ejs", {nomeUsuarioSession: nomeUsuarioSession, sessao1:sessao1})

    }

})


app.listen(8080, () =>{
    console.log("O servidor foi executado")
})

