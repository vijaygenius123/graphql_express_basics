const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList} = require('graphql');

const {books, authors} = require('./data/data')

const PORT = process.env.PORT || 8080;
const app = express();

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Author of the book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "Book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (parent) => {
                return authors.find(author => author.id === parent.authorId)
            }
        }
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "A Single Book",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (source, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        author: {
            type: AuthorType,
            description: "A Single Author",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (source, args) => {
                return authors.find(author => author.id === args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of all books",
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all authors",
            resolve: () => authors
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use("/graphql", graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);

app.listen(PORT, () => {
    console.log(`Started Server On ${PORT}`)
});
