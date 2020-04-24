const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

exports.index = function(req, res){
    return res.render("instructors/index", { instructors: data.instructors } )
}

exports.post = function(req, res){

    // Validação de dados
    const keys = Object.keys(req.body)

    for(key of keys){
        if (req.body[key] == "")
        return res.send("Please, fill all fields")
    }

    // Desestruturação de dados
    let { avatar_url, birth, name, services, gender } = req.body


    // Tratamento de dados
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)


    // Organização dos dados que eu quero passar
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })

}

exports.show = function (req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")


    const instructor = {
        ...foundInstructor, 
        age: age(foundInstructor.birth), // Utilizando a função criada
        services: foundInstructor.services.split(','), // Vai transformar a string em um array, e eu posso usar no arquivo njk fazendo um for para pegar todas as informações passadas no array
        created_at: Intl.DateTimeFormat('en-GB').format(foundInstructor.created_at), // Formatação da data np formato BR
    }
console.log(instructor.services)
    return res.render("instructors/show", { instructor })
}

exports.create = function(req, res ){
    return res.render("instructors/create")
}

exports.edit = function(req, res){
    //req.params
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,      
        birth: date(foundInstructor.birth).iso
    }
    
    
    return res.render("instructors/edit", { instructor })

}

exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (instructor.id == id)
        index = foundIndex
        return true
    })

    if(!foundInstructor) return res.send("Instructor not found!") 

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2),function(err){
        if (err) return res.send("Write file error!")
 
        return res.redirect(`/instructors/${id}`)
    })

      
}

exports.delete = function (req, res ){
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if(err) return res.send("Write file error!")
    })


    return res.redirect("/instructors")
}
