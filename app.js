

var express = require('express')
,   routes = require('./routes')
,   fc=require('fastcrud') 
,   fauthentication=require('fauthentication') 
,   MemStore = express.session.MemoryStore
,   RedisStore = require('connect-redis')(express);


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options',{layout:false})
    //app.register('.html',require('html'))

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));

    app.use(express.cookieParser())
    app.use(express.session({ 
        store: new RedisStore, 
        secret: "olaolac",
    }))
    //app.use(app.router);

});
app.dynamicHelpers({
    session: function(req, res){
        return req.session;
    }
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes



app.get('/', function(req,res){res.render('index',{})});
app.get('/logout',function(req,res){delete req.session.user; res.redirect('/')})

fauthentication.settings({
    client_id: '194622933989729',
    client_secret: '44db9515168f6c2d3ba9f7689a65d47e',
    redirect_uri: 'http://localhost:3000/fauthentication/getAccessToken',
    app: app,
    callback: function(req,res,next,accessToken,user){
        req.session.user=user 
        next()
    }
})
var checkAuthentication=function(req,res,next){
    console.log('req',req.session.user);
    if (req.session.user){
        console.log('yes');
        next()
    }else{
        res.redirect('/')
    }
}
app.get('/fauthentication/authenticate',fauthentication.auth)
app.get('/subscribe',checkAuthentication,function(req,res){ res.render('subscribe',{}) })

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

var CourseModel=fc.Model({
    Course:{
        name: 'course-name',
        subscriptions: []
    }
})
var SubscriptionModel=fc.Model({
    Subscription: {
        user:{
            name: 'name',
            username: 'username',
            link: 'link'
        }
    }
})
CourseModel.setAPI(app)
SubscriptionModel.setAPI(app)
var Course=fc.get('Course')
var courses=[
'Algoritmi e strutture dati',
'Analisi matematica',
'Analisi e progettazione del software',
'Analisi dei Sistemi ad Eventi',
'Basi di Dati I',
'Calcolatori Elettronici',
'Chimica',
'Controllo digitale',
'Economia Applicata all\'Ingegneria',
'Elettrotecnica ed Elettronica',
'Fisica',
'Fondamenti di Automatica',
'Fondamenti di Informatica',
'Fondamenti di Telecomunicazioni',
'Geometria e Combinatoria',
'Gestione dei Progetti',
'Programmazione Funzionale',
'Programmazione Orientata agli Oggetti',
'Reti di Calcolatori I',
'Reti e Sistemi per l\'Automazione',
'Ricerca Operativa I',
'Sistemi Informativi sul Web',
'Sistemi Operativi',
'Architetture Software',
'Basi di Dati II',
'Calcolo Parallelo e Distribuito',
'Comunicazioni Ottiche',
'Controllo Digitale',
'Elementi di Crittografia',
'Gestione dell\'Informazione su Web',
'Grafica Computazionale',
'Informatica Biomedica',
'Informatica Teorica',
'Infrastrutture delle Reti di Calcolatori',
'Intelligenza Artificiale',
'Logica e Sistemi Informatici',
'Ottimizzazione Combinatoria',
'Programmazione Concorrente',
'Ricerca Operativa II',
'Sicurezza dei Sistemi Informatici e delle Reti',
'Sistemi Informativi',
'Sistemi Intelligenti per Internet',
'Sistemi Quantistici per l\'Informatica',
'Telecomunicazioni Wireless',
]
Course.remove({},function(){
    
    courses.forEach(function(courseName){
        new Course({
            name: courseName,
            subscriptions: []
        }).save(function(err,doc){
            console.log(err,'saved',courseName);
        })
    })
})