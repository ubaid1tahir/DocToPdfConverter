const express = require('express')
const path = require('path')
const fs = require('fs')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const app = express()
const port = 1000;
var convertapi = require('convertapi')('EbcrXOuHjhIXqrRi');

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    return cb(null, './uploads');
  },
  filename: function(req,file,cb){
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.post('/convert',upload.single('docx'), async function (req, res, next) {
  const file = req.file;
  if(!file){
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
    convertapi.convert('pdf', { File: path.join(__dirname,`./uploads/${req.file.filename}`) })
  .then(function(result) {
    // get converted file url
    console.log("Converted file url: " + result.file.url);

    // save to file
    return result.file.save(path.join(__dirname,'result.pdf'));
  })
  .then(function(file) {
    console.log("File saved: " + file);
    res.sendFile(path.join(__dirname,'result.pdf'));
  })
  .catch(function(e) {
    console.error(e.toString());
  });
})
app.listen(port, ()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})
  