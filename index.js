const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/connection")
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


connection
    .authenticate()
    .then(() =>{
        console.log("Conexão ao banco de dados realizada com sucesso")
    }).catch((error) =>{
        console.log("Erro na conexão com o banco de dados")
    })

app.use("/", UserController)
app.use("/", InstrutorController)
app.use("/", CursoController)


app.get("/" , (req,res) =>{
    res.render("home/home.ejs")
})




app.listen(8080, () =>{
    console.log("O servidor foi executado")
})

