const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/",  function(req,res){
    fs.readdir(`./hisaab`, function (err,files){;
        if (err) return res.send(err)
        res.render("index" , {files: files});
    })
});

app.get("/create", function (req,res){
    res.render("create")
})

app.post("/createhisaab", function (req,res){

    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const folder = path.join(__dirname, 'hisaab');
    const baseName = date;
    const extension = 'txt';

    let count = 0;
    let fileName = `${baseName}.${extension}`;
    let filePath = path.join(folder, fileName);

    function createUniqueFile() {
        fs.stat(filePath, function (err) {
            if (err) {
                
                fs.writeFile(filePath, req.body.content, function (err) {
                    if (err) return res.send("Error creating file");
                    res.redirect("/");
                });
            } else {
                
                count++;
                fileName = `${baseName}(${count}).${extension}`;
                filePath = path.join(folder, fileName);
                createUniqueFile();
            }
        });
    }

    createUniqueFile();
})

app.get("/edit/:filename", function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function(err,filedata){
        if(err) return res.send(err)
        res.render("edit", { filedata, filename: req.params.filename});
            
    })
})

app.post("/update/:filename", function(req,res){
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, function(err){
        if(err) return res.send(err);
        res.redirect("/");
    })
})

app.get("/hisaab/:filename", function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function(err,filedata){
        if(err) return res.send(err);
        res.render("hisaab", {filedata, filename: req.params.filename});
    })
})

app.get("/delete/:filename", function(req,res){
    fs.unlink(`./hisaab/${req.params.filename}`, function(err){
        if(err) return res.send(err);
        res.redirect("/");
    })
})


app.listen(3000);