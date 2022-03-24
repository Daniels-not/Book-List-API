// imports

const graphql = require('graphql');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;
const Book = require('./models/booksModule');
const Author = require('./models/authorModule');


// types


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        description: { type: GraphQLString },
        authorID: { type: GraphQLID },

        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorID);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        description: { type: GraphQLString },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorID: parent.id });
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                description: { type: GraphQLString}
            },

            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age,
                    description: args.description
                })

                return author.save();
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString},
                authorID: { type: GraphQLID }
            },

            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    description: args.description,
                    authorID: args.authorID
                })

                return book.save();
            }
        }
    }
})


// root shema


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: { // type to manage books
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // code to get data from db / other source
                return Book.findById(args.id);
            }
        },

        author: { // type to manage author
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});

// schema


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});