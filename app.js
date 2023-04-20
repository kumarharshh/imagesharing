const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();


const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});


function checkFileType(file, cb) {
 
  const filetypes = /jpeg|jpg|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');


app.use(express.static('./public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));


app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.send(err);
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!');
      } else {
        res.send(`<img src="/uploads/${req.file.filename}">`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));