const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList} = require('graphql');

const {books, authors} = require('./data/data')

const PORT = process.env.PORT || 5000;
const app = express();

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "Author of the book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
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
                return authors.find(author => author.id === parent.id)
            }
        }
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: "List of all books",
            resolve: () => books
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
