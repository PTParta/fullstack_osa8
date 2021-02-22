const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'


require('dotenv').config()
let MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/* authors.forEach(author => {
  const newAuthor = new Author({ name: author.name, born: author.born })
  newAuthor.save()
})
*/

/* books.forEach(book => {
  const newBook = new Book(book)
  newBook.save()
}) */

//Used to initialize MongoDB books
/* const findAuthor = async (author) => {
  const foundAuthor = await Author.findOne({ name: 'Fyodor Dostoevsky' })
  console.log(foundAuthor)
  await Book.findOneAndUpdate({ title: 'The Demon ' }, { author: foundAuthor })
} */
//findAuthor()

const typeDefs = gql`
  
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    //allbooks query doesn't work with parameter author = Author
    allBooks: async (root, args) => {
      if (args.author === undefined && args.genre === undefined) {
        //return books
        return Book.find({})
      } else if (args.author === undefined) {
        return await Book.find({ genres: { $in: args.genre } })
        //return books.filter(book => book.genres.includes(args.genre))
      } else if (args.genre === undefined) {
        return books.filter(book => book.author === args.author)
      }
      return books.filter(book => book.author === args.author && book.genres.includes(args.genre))

    },
    //allAuthors: () => authors
    allAuthors: () => Author.find({}),
    me: (root, args, context) => {
      //console.log('context', context)
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const booksByAuthors = await Book.find({ author: { $in: root.id } })
      //console.log('booksByAuthors: ', booksByAuthors)
      return booksByAuthors.length
    }
  },
  Book: {
    author: async (root) => Author.findById(root.author)
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      console.log('current user', currentUser)

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      const author = await Author.findOne({ name: args.author })
      console.log('author', author)

      if (author) {
        const book = new Book({ ...args, author: author })
        try {
          await book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        return book
      }

      const newAuthor = new Author({ name: args.author })
      try {
        await newAuthor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      const book = new Book({ ...args, author: newAuthor })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      console.log('current user', currentUser)

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      return author
    },
    createUser: (root, args) => {
      console.log('createUser')
      console.log('args', args)
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})