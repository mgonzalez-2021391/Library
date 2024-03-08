import Book from './book.model.js'
import User from '../user/user.model.js'

export const save = async (req, res) => {
  try {
    let data = req.body;
    let book = new Book(data);
    await book.save();
    return res.send({ message: "Book created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Error creating book'})
  }
}

export const borrowBook = async(req, res) => {
    try {
        let { userId, bookId } = req.body
        let user = await User.findById(userId).populate('books')
        let book = await Book.findById(bookId)
        if (book.state === 'BORROWED') {
            return res.status(400).send({ message: 'Book has been borrowed' })
        }
        if (user.books.some(userBook => userBook.equals(bookId))) {
            return res.status(400).send({ message: 'A user has been borrowed the book' })
        }
        book.state = 'BORROWED'
        user.books.push(bookId)
        await book.save()
        await user.save()
        return res.send({message: 'Book borrowed successfully'})
    } catch (err) {
        console.error(err);
    return res.status(500).send({message: 'Error borrowing book'})
    }
}

export const returnBook = async(req, res) => {
    try {
        let { userId, bookId } = req.body
        let user = await User.findById(userId).populate('books')
        let book = await Book.findById(bookId)
        if (book.state === 'BORROWED') {
            return res.status(400).send({ message: 'Book has been borrowed' })
        }
        if (!user.books.some(userBook => userBook.equals(bookId))) {
            return res.status(400).send({ message: 'The book has not been borrowed to the user' });
        }
        book.state = 'AVAILABLE'
        user.books = user.books.filter(userBook => userBook._id.toString() !== bookId);
        await book.save()
        await user.save()
        return res.send({message: 'Book returned successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error returning book'})
    }
}

export const updateBook = async(req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = (data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateBook = await Book.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateBook) return res.status(404).send({message: 'Book not found and not updated'})
        return res.send({message: 'Book updated successfully'})
    } catch (err) {
        console.error(err)
    }
} 

export const deleteBook = async(req, res) => {
    try {
        let { id } = req.params
        let deleteBook = await Book.findOneAndDelete({_id: id}) 
        if(!deleteBook) return res.status(404).send({message: 'Book not found and not deleted'})
        let usersWithBook = await User.find({ books: id });
        if (usersWithBook.length > 0) {
            for (let user of usersWithBook) {
                user.books = user.books.filter(book => !book.equals(id));
                await user.save();
            }
        }
        return res.send({message: 'Book deleted successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error deleting book'})
    }
}

export const getBook = async (req, res) => {
    try {
        let { name } = req.body
        let book = await Book.find({name: name})
        return res.send({book})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching a book'})
    }
}

export const getBooks = async (req, res) => {
    try {
        let books = await Book.find().populate('category', ['name'])
        return res.send({books})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching books'})
    }
}

export const getBooksOrdenated = async (req, res) => {
    try {
        let books = await Book.find().populate('category', ['name']).sort({name: 1})
        return res.send({books})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching books'})
    }
}

export const getBooksWithCategory = async (req, res) => {
    try {
        let { id } = req.body
        let book = await Book.find({category: id})
        return res.send({book})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching books'})
    }
}