const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbpath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;

const moviesNameList=(object){
    return { movieName:object.movie_name }
}
const initializationOfDatabase = async() => {
    try{

   db=open({
        filename:dbpath
        driver:sqlite3.Database
    })
    app.listen(3000,()=>
    console.log('server running'))
  }catch(e){
      console.log(`db error ${e.message}`)
      process.exit(1)
  }
};
initializationOfDatabase()

app.get('/movies/',async(request,response)=>{
    const moviename=`select * from movie;`
    const moviesnames=await db.all(moviename)
    response.send(moviesnames.map((eachMovie)=>
    moviesNameList(eachMovie)))

})
ap.post('/movies/',async(request,response)=>{
    const {movieId,directorId,movieName,leadActor}=request.body
    const postMovie=`insert into movie movie_id,director_id,movie_name,lead_actor
    value(${movieId},${directorId},${movieName},${leadActor};`
    const moviesName = await db.run(postMovie)
    response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async(request,response)=>{
    const {movieId}=require.params
    const getmovie=`select * from movie where movie_id = ${movieId};`
    const moviesName=await db.get(getmovie)
    response.send(moviesName)

})

app.put('/movies/:movieId/', async(request,response)=>{
    const {directorId,movieName,leadActor}=request.body
    const{movieId}=request.params
    const putmovie = `update movie 
                                set
                                director_id=${directorId},
                                movie_name=${movieName},
                                lead_actor=${leadActor}
                                where movie_id = ${movieId};`
    const moviesName = await db.run(putmovie)
    response.send('Movie Details Updated')
})