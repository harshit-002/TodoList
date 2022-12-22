//jshint esversion:6

const express=require("express")
const app=express();
const mongoose=require("mongoose")
const _=require("lodash")
require('dotenv').config();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.set('view engine','ejs');


mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URL, { 
    useNewUrlParser: true ,
    useUnifiedTopology:true  
})         

const itemschema=new mongoose.Schema({
    name:String
})
const item= mongoose.model("item",itemschema);

const item1=new item({
    name:"Welcome to your todoList"
});

const item2=new item({
    name:"Hit the + button to add a new item"
});

const item3=new item({
    name:"<--Hit this button to delete an item"
})

const defaultitems=[item1,item2,item3];

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemschema]
})

const List= mongoose.model('List',listSchema);



app.get("/",function(req,res){

    item.find(function(err,founditems){

        if(founditems.length===0)
        {
            item.insertMany(defaultitems,function(err){
                if(err)
                console.log(err)
                else{
                    console.log("items added successfully");
                }
            })
            res.redirect("/")
        }
        else
        res.render('list',{listTitle:"Today" ,newlistitems:founditems});
    })
})

app.get("/:customListname",function(req,res){
   const customListname=_.capitalize( req.params.customListname);
    if(List.findOne({name:customListname},function(err,foundlist){
       if(!err){
        if(!foundlist){
            const list=new List({
                name:customListname,
                items:defaultitems
               })
               list.save();
               res.redirect("/"+customListname);
        }
        else{
            res.render('list',{listTitle:foundlist.name ,newlistitems:foundlist.items});
        }

       }
       else{
           console.log(err);
       }
    }));

    

   

})


app.post("/",function(req,res){
   const itemName=req.body.item;
   const listTitle=req.body.list;

   const newitem=new item({
    name:itemName
   })

   if(listTitle==="Today"){
      newitem.save();
     res.redirect("/")
   }
   else{
    List.findOne({name:listTitle},function(err,foundlist){
        foundlist.items.push(newitem)
        foundlist.save()
        res.redirect("/"+listTitle)
    })
   }
   
})

app.post("/delete",function(req,res){
   const checkedItemId= req.body.checkbox;
   const listname=req.body.listname;

   if(listname==="Today"){
    item.findByIdAndDelete(checkedItemId,function(err){
        if(err)
        console.log(err);
        else{
            console.log("deleted");
            res.redirect("/")
        }
       })  
   }
   else{
    List.findOneAndUpdate({name:listname},{ $pull:{items:{_id:checkedItemId}} },function(err,foundlist){
        if(!err){
            res.redirect("/"+listname);
        }
        else{
            console.log(err);
        }
    })

   }
   
  
})


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
  