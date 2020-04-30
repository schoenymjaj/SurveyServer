const winston = require('winston');
const globals = require('../globals');

var performDataSetup = async function() {

    globals.logger.log('verbose', "performDataSetup START ------------------------------------------------------"); 
    console.log("performDataSetup START ------------------------------------------------------"); 

    globals.mongoose = require('mongoose');
    dbConnect(); 

    globals.logger.log('verbose', "MongoDB myfirstmongodb db successfully connected"); 
    
    setupCollections();
    globals.logger.log('verbose', "Setup Author and Book collections/schemas"); 

    //DELETE ALL RECORDS
    // countAfterAuthorDelete = await deleteAllRecords(globals.Author);
    // countAfterBookDelete = await deleteAllRecords(globals.Book);
    // return;

    aDate = new Date();
    author = {
        _id: new globals.mongoose.Types.ObjectId(),
        name: {
            firstName: 'Jason',
            lastName: 'Schoenfeld'
        },
        biography: 'Next great american composer',
        twitter: 'https://twitter.com/endyourif',
        facebook: 'https://www.facebook.com/End-Your-If-194251957252562/',
        linkedin: 'https://www.linkedin.com/in/addAuthorAndBook - ' + aDate.toLocaleDateString() + ' ' +  aDate.toLocaleTimeString()
    };

    book = {
        _id: new globals.mongoose.Types.ObjectId(),
        title: 'Another Davinci',
        ratings:[{
            summary: 'Fantastic read'
        }]
    };

    result = await addAuthorAndBook(author, book);
    globals.logger.log('verbose', "addAuthorAndBook:" + result);

    id = '5e2e55bb81d2595f480f79e3';
    linkedinName = 'https://www.linkedin.com/in/jason-to-be-renowned-composer/'
    updatedAuthor = await updateAuthor(id, linkedinName);

    id = '5e2e07307777265978aed7e7';
    linkedinName = 'https://www.linkedin.com/in/from-updateAuthor2-function/'
    updatedAuthor = await updateAuthor2(id, linkedinName);

    var entities;
    entities = await getRecords(globals.Author,{});
    globals.logger.log('verbose', "Authors Read:" + entities); 
    entities = await getRecords(globals.Book,{});
    globals.logger.log('verbose', "Books Read:" + entities);

    entities = await getRecords(globals.Author, {biography: 'Next great american composer'});
    globals.logger.log('verbose', "Just Jason Records:" + entities); 

    id = '5e2e07307777265978aed7e8';
    aBookById = await getBookById(id);
    
    twitterName = 'https://twitter.com/endyourif';
    authorsByTwitter = await getAuthorsByTwitterName(twitterName);
    
    titleInp = '/mvc/i';
    booksByTitle = await getBooksByTitle(titleInp);

    selectCriteriaAuthor = { linkedin: 'https://www.linkedin.com/in/from-updateAuthor2-function/'};
    selectCriteriaBook = { title: 'Arnolds World Series Win'};

    authorCount = await getCount(globals.Author, selectCriteriaAuthor);
    bookCount = await getCount(globals.Book, selectCriteriaBook);
    globals.logger.log('verbose', "Author Count:" + authorCount); 
    globals.logger.log('verbose', "Book Count:" + bookCount); 

    
    globals.logger.log('verbose', "performDataSetup END ------------------------------------------------------"); 
    console.log("performDataSetup END ------------------------------------------------------"); 
        
} //performDataSetup

var dbConnect = function() {
    globals.mongoose = require('mongoose');
    globals.mongoose.connect('mongodb://localhost/myfirstmongodb', 
            {useUnifiedTopology: true, useNewUrlParser: true});   
}

var setupCollections = function() {

    globals.mongoose.set('useNewUrlParser', true);
    globals.mongoose.set('useFindAndModify', false);
    globals.mongoose.set('useCreateIndex', true);
    globals.mongoose.set('useUnifiedTopology', true);

    var authorSchema = globals.mongoose.Schema({
        _id: globals.mongoose.Schema.Types.ObjectId,
        name: {
                firstName: String,
            lastName: String
        },
        biography: String,
        twitter: String,
        facebook: String,
        linkedin: String,
        profilePicture: Buffer,
        created: { 
            type: Date,
            default: Date.now
        }
    });

    var bookSchema = globals.mongoose.Schema({
        _id: globals.mongoose.Schema.Types.ObjectId,
        title: String,
        summary: String,
        isbn: String,
        thumbnail: Buffer,
        author: { 
            type: globals.mongoose.Schema.Types.ObjectId, 
            ref: 'Author'
        },
        ratings: [
            {
                summary: String,
                detail: String,
                numberOfStars: Number,
                created: { 
                    type: Date,
                    default: Date.now
                }
            }
        ],
        created: { 
            type: Date,
            default: Date.now
        }
    });

    globals.Author = globals.mongoose.model('Author', authorSchema);
    
    globals.Book = globals.mongoose.model('Book', bookSchema);


} //var setupCollections = function()


/*  *******************************************************************
    addAuthorAndBook() promise: will return authorNew
*/
var addAuthorAndBook = function(author, book, data) {
    return new Promise((resolve,reject) => {

        var newAuthor = new globals.Author (author);

        newAuthor.save(function(err) {
            if (err) {
                reject(err);
            }
        
            globals.logger.log('verbose','Author successfully saved.');
            
            book.author = author._id; //link book to author
            var mvcBook = new globals.Book (book);
            
            mvcBook.save(function(err) {
                if (err) {
                    reject(err);
                }
            
                globals.logger.log('verbose','Book successfully saved.');
                resolve(newAuthor);
                
            });
        }); //joshAllen.save

    }); //new Promise

} //addAuthorAndBook


/*  *******************************************************************
    updateAuthor(id, linkedinName) 
    return author
    example: linkedinName = 'https://www.linkedin.com/in/jamie-munro-8064ba1a/'
*/
var updateAuthor = function(id, linkedinName) {
    return new Promise((resolve,reject) => {    

        globals.Author.findById(id, function(err, author) {
            if (err) {
                reject(err);
            }
            
            author.linkedin = linkedinName;
            
            author.save(function(err) {
                if (err) {
                    reject(err);
                }
                    
                resolve(author);
            });
        });

    });
} //updateAuthor = function(id, linkedinName)

/*  *******************************************************************
    updateAuthor2(id, linkedinName) 
    return author
    example: linkedinName = 'https://www.linkedin.com/in/josh-go-bills/'
*/
var updateAuthor2 = function(id,linkedinName) {
    return new Promise((resolve,reject) => {    

        globals.Author.findByIdAndUpdate(id, 
            { linkedin: linkedinName}, 
            function(err, author) {
                if (err) {
                    reject (err);
                }
            
                resolve(author);
        });  
    }); 

} //updateAuthor2 = function(id,linkedinName)


/*  *******************************************************************
    getRecords(inputModel, selectCriteria) 
    return list of documents
*/
var getRecords = function(inputModel, selectCriteria) {
    return new Promise((resolve,reject) => {

        //ENTITY.FIND ALL - WORKS WELL
        inputModel.find(selectCriteria).exec(function(err, entities) {
            if (err) {
                reject(err);
            }
            
            //globals.logger.log('verbose', 'ALL Model Name (' + inputModel.modelName + '): ' + entities);
            resolve(entities);
        });

    });

} //getRecords = function(inputModel)

var getById = function(inputModel, id) {
    return new Promise((resolve,reject) => {    

        inputModel.findById(id, function(err, entity) {
            if (err) {
                reject(err);
            }

            resolve(entity);
        });

    });

} //getById = function(inputModel, id)

/*  *******************************************************************
    getBookById(id) 
    return book
*/
var getBookById  = function(id) {
    return new Promise((resolve,reject) => {    

        globals.Book.findById(id, function(err, book) {
            if (err) {
                reject(err);
            }

            resolve(book);
        });

    });

} //getBookById  = function(id)

/*  *******************************************************************
    getAuthorsByTwitterName(twitterName) 
    return author
    example: 'https://twitter.com/endyourif'
*/
var getAuthorsByTwitterName = function(twitterName) {
    return new Promise((resolve,reject) => {    
 
        globals.Author.find({
            twitter: twitterName
        }).exec(function(err, authors) {
            if (err) {
                reject(err);
            }
            
            resolve(authors);
        });
    });
} //getAuthorsByTwitterName = function(twitterName)

/*  *******************************************************************
    getBooksByTitle(titleInp) 
    return books
    example: titleInp: '/mvc/i'
*/
var getBooksByTitle = function(titleInp) {
    return new Promise((resolve,reject) => {    

        globals.Book.find({
            title: titleInp
        }).exec(function(err, books) {
            if (err) {
                reject(err);
            }
            
            resolve(books);
        });
    });
} //getBooksByTitle = function(titleInp)

/*  *******************************************************************
    getCount(inputModel,linkedName) 
    return count of scheme (document table)
    //example: linkedin = 'https://www.linkedin.com/in/josh-go-bills/'
*/
var getCount = function(inputModel, selectCriteria) {
    return new Promise((resolve,reject) => {    

        inputModel.countDocuments(selectCriteria, function (err, count) {
            if (err) {
                reject(err);
            }
            
            resolve(count);
        });

    });

    //works
    // inputModel.count({ }, function (err, count) {
    //     if (err) throw err;

    //     globals.logger.log('verbose', 'Author.count(ALL before): there are %d authors', count);
    // });

} //getCount = function(inputModel, linkedinName)

/*  *******************************************************************
    deleteRecord(inputModel, id) 
    deletes the record uniquely identified with an id
    return count
*/
var deleteRecord = function(inputModel, id) {
    return new Promise((resolve,reject) => {    

        inputModel.deleteOne({ _id: id }, function (err) {
            if (err) {
                reject(err);
            }
            // deleted at most one document

            inputModel.count({ }, function (err, count) {
                if (err) {
                    reject(err);
                }

                resolve(count);
            });

        }); //inputModel.deleteOne

    });

} //deleteRecord = function(id)

/*  *******************************************************************
    deleteAllRecords(inputModel) 
    deletes all the records of document table
    return count
*/
var deleteAllRecords = function(inputModel, data) {
    return new Promise((resolve,reject) => {

    status = false;

        inputModel.deleteMany({ }, function (err) {
            if (err) {
                reject(err);
            }

            inputModel.count({ }, function (err, count) {
                if (err) {
                    reject(err);
                }

                globals.logger.log('verbose', 'inputModel.count(' + inputModel.modelName + '): there are now %d documents', count);
                resolve(count);
            });
        });

    }); return new Promise

} //deleteAllRecords = function(inputModel)

module.exports = {
    performDataSetup: performDataSetup,
    addAuthorAndBook: addAuthorAndBook,
    deleteRecord: deleteRecord,
    deleteAllRecords: deleteAllRecords,
    getRecords: getRecords,
    getAuthorsByTwitterName: getAuthorsByTwitterName,
    getBookById: getBookById,
    getBooksByTitle: getBooksByTitle,
    getById: getById,
    updateAuthor: updateAuthor,
    updateAuthor2: updateAuthor2,
    getCount: getCount
}