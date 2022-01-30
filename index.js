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
    const body = req.body;
    searchWords(req, res, body);
})

const searchWords = (req, res, body) => {
    const { match, guess, guessPosition, wrong, language } = body;
    
    let path = '';
    switch (language) {
        case 'portuguese':
            path = 'palavras.txt';
            break;
        case 'english':
            path = 'word.txt';
            break;
        default: 
            path = 'palavras.txt';
    }

    readFile(path, (err, data) => {
        if (err) throw err;
        let words = data.toString('utf-8').toLocaleLowerCase().split(' ');
    
        const filteredWords = words.filter(word => {
            const from = "ãàáäâèéëêìíïîòóöôùúüûñ";
            const to   = "aaaaaeeeeiiiioooouuuun";
            for (var i=0, l=from.length ; i<l ; i++) {
                word = word.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }
    
            for(let i=0; i<5; i++) {
                if (match[i]) {
                    if(!(word.split('')[i] === (match[i]))) {
                        return false;
                    }
                }
            }

            const guesses = Object.values(guess).filter(k => k !== '');

            for(let i=0; i<guesses.length; i++){
                if(!(word.indexOf(guesses[i]) > -1)){
                    return false;
                }
            }

            for(let i=0; i<wrong.length; i++){
                if(word.indexOf(wrong[i]) > -1){
                    return false;
                }
            }

            return word;
            })
    
            res.send(filteredWords);
    });
}

app.listen(3000, () => {
    console.log('rodando na porta 3000')
});