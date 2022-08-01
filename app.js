

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemSchema = {
  name: String
}

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Complete Cpp"
});
const item2 = new Item({
  name: "Complete Backend"
});
const item3 = new Item({
  name: "Get  ready for college"
});

const defaultItems = [item1, item2, item3];






app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems){

  if(foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("added items successfully");
        }
      });
      res.redirect("/");
  }
  else{
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      } 
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  
  // console.log(req.body.checkedbox);


   const checkedItemId = req.body.checkedbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err) {
        console.log(err);
      }
      else{
        console.log("succesfully removed the item");
        res.redirect("/");
      }
    });
   
    
 
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
