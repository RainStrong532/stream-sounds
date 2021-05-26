
const express = require('express'),
    fs = require('fs'),
    app = express();

const pug = require('pug');

const port = process.env.PORT || 8000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use("/public", express.static("public"));

const data = [
    {
        id: 1,
        audio: "dechoanhkhoc.mp3",
        imageName: "LeBaoBinh.jpg",
        singerName: "Lê Bảo Bình",
        title: "Để cho anh khóc"
    },
    {
        id: 2,
        audio: "khoccungem.mp3",
        imageName: "mrSiro.jpg",
        singerName: "Mr.Siro",
        title: "Khóc cùng em"
    },
    {
        id: 3,
        audio: "vebenanh.mp3",
        imageName: "Jack.jpg",
        singerName: "Jack",
        title: "Về bên anh"
    },
    {
        id: 4,
        audio: "closer.mp3",
        imageName: "The Chainsmokers.jpg",
        singerName: "The Chainsmokers, Halsey",
        title: "Closer"
    },
    {
        id: 5,
        audio: "wakemeup.mp3",
        imageName: "Avicii.jpg",
        singerName: "Avicii",
        title: "Wake me up"
    },
    {
        id: 6,
        audio: "shapeofyou.mp3",
        imageName: "The Chainsmokers.jpg",
        singerName: "The Chainsmokers, Halsey",
        title: "Closer"
    },
    {
        id: 7,
        audio: "shapeofyou.mp3",
        imageName: "Ed Sheeran.jpg",
        singerName: "Ed Sheeran",
        title: "Shape of you"
    },
    {
        id: 8,
        audio: "soami.mp3",
        imageName: "Ava Max.jpg",
        singerName: "Ava Max",
        title: "So Am I"
    },
    {
        id: 9,
        audio: "letmedownslowly.mp3",
        imageName: "Alec Benjamin.jpg",
        singerName: "Alec Benjamin",
        title: "Let me down slowly"
    }
]

app.get('/', (req, res) => {
    res.render('index', { data: data });
});

app.get('/stream/:id', (req, res) => {
    const id = req.params.id;
    const music = data.find((item) => item.id == id);
    if (music) {
        const file = __dirname + '/data/audio/' + music.audio;
        const stat = fs.statSync(file);
        const total = stat.size;
        if (req.headers.range) {

        }
        fs.exists(file, (exists) => {
            if (exists) {
                const range = req.headers.range;
                const parts = range.replace(/bytes=/, '').split('-');
                const partialStart = parts[0];
                const partialEnd = parts[1];

                const start = parseInt(partialStart, 10);
                const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
                const chunksize = (end - start) + 1;
                const rstream = fs.createReadStream(file, { start: start, end: end });


                res.writeHead(206, {
                    'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                    'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg'
                });
                rstream.pipe(res);

            } else {
                res.send('Error - 404');
                res.end();
                // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
                // fs.createReadStream(path).pipe(res);
            }
        });
    }else{
        res.send("Id is not valid");
    }
});

app.get('/download/:id', (req, res) => {
    const id = req.params.id;
    const music = data.find((item) => item.id == id);
    if (music) {
        const file = __dirname + '/data/audio/' + music.audio;
        res.download(file);
    }
    res.send("Id is not valid");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
