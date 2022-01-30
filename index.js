const express = require('express');
const { readFile } = require('fs');
const bodyParser = require('body-parser')
const cors = require('cors')
const { engine } = require('express-handlebars')

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views','./views/layouts')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.render('index', { layout: false })
})

app.post('/', (req, res) => {
    const body = req.body
    procurarPalavras(req, res, body)
})

const procurarPalavras = (req, res, body) => {
    const { match, guess, wrong } = body;
    readFile('palavras.txt', (err, data) => {
        if (err) throw err;
        let palavras = data.toString('utf-8').toLocaleLowerCase().split(' ');
    
        const palavrasFiltradas = palavras.filter(palavra => {
            const from = "ãàáäâèéëêìíïîòóöôùúüûñ";
            const to   = "aaaaaeeeeiiiioooouuuun";
            for (var i=0, l=from.length ; i<l ; i++) {
                palavra = palavra.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
    
            for(let i=0; i<5; i++) {
                if (match[i]) {
                    if(!(palavra.split('')[i] === (match[i]))) {
                        return false;
                    }
                }
            }

            const guesses = Object.values(guess).filter(k => k !== '');

            for(let i=0; i<guesses.length; i++){
                if(!(palavra.indexOf(guesses[i]) > -1)){
                    return false;
                }
            }

            for(let i=0; i<wrong.length; i++){
                if(palavra.indexOf(wrong[i]) > -1){
                    return false;
                }
            }

            return palavra;
            })
    
            res.send(palavrasFiltradas);
    });
}

app.listen(3000, () => {
    console.log('rodando na porta 3000')
});