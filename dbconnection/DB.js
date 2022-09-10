const knex = require('knex')({
    client:'mysql',
    connection:{
        user:'root',
        host:'localhost',
        database:'crud1',
        password:'1'
    }
})
knex.schema.createTable('userData',(table)=>{
    table.increments('id')
    table.string('name').notNullable()
    table.string('email').unique().notNullable()    
    table.string('password').notNullable()
    table.integer('age').notNullable()
}).then(()=>{
    console.log('table created successfully....');
}).catch(()=>{
    console.log('table allready exist....');
})  
module.exports = knex