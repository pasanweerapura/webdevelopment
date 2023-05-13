// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

//place below the const app = exress();
//copy exactly the same.



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // to be able to access css in list.ejs




mongoose.connect("mongodb+srv://admin-pasan:Test1234@cluster0.qlikf.mongodb.net/todolistDB");


const itemsSchema = {
  name:String

};


const Item = mongoose.model("Item",itemsSchema);


const item1 = new Item({

  name:"Welcome to your todolist!"

});

const item2 = new Item({

  name:"Welcome to your todolist!"

});

const item3 = new Item({

  name:"Welcome to your todolist!"

});


const defaultItems = [item1,item2,item3];


const listSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List",listSchema);


//GET function for home route
app.get ("/", function(req,res){

  Item.find({},function (err,foundItems) {

    if(foundItems.length===0){
      Item.insertMany(defaultItems,function (err) {
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default items to DB.")

        }
      });

      res.redirect("/");
    }else {
          res.render("list", {listTitle:"Today", newListItems: foundItems});
    }
  });




});




app.get("/:customListName",function (req,res) {

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName},function (err,foundList) {

    if(!err)
    {
      if(!foundList)
      {
        const list = new List
        ({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else
      {
        res.render("list",{listTitle:foundList.name, newListItems: foundList.items});

      }
    }

  });








});












//POST function for home route
app.post("/", function(req, res){
  // console.log(req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;




  const item = new Item({
    name:itemName
  })


  if(listName==="Today"){
    item.save();

    res.redirect("/");

  }else{
    List.findOne({name:listName},function (err,foundList) {

      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);

    })
  }






});







app.post("/delete",function (req,res) {

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;


  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function (err) {

      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }

    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function (err,foundList) {
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }



});










//GET function for Work route
app.get("/work", function(req,res){
  res.render("list", {listTitle:"Work list", newListItems:workItems});
});



//GET function for About route

app.get("/about", function(req,res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
console.log("Server is running on port 3000");
});
