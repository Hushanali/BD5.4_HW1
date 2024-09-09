let express = require('express');
let { book } = require('./models/book.model');
let { author } = require('./models/author.model');
let { sequelize } = require('./lib/index');
let app = express();

app.use(express.json());

// Data
let books = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    genre: 'Fantasy',
    publicationYear: 1997,
  },
  { title: 'A Game of Thrones', genre: 'Fantasy', publicationYear: 1996 },
  { title: 'The Hobbit', genre: 'Fantasy', publicationYear: 1937 },
];

let authors = [{ name: 'J.K Rowling', birthYear: 1965 }];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await book.bulkCreate(books);

    await author.bulkCreate(authors);

    return res.status(200).json({ message: 'Database seeding successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1
async function addNewAuthor(newAuthor) {
  let newData = await author.create(newAuthor);

  return { newData };
}

app.post('/authors/new', async (req, res) => {
  try {
    let newAuthor = req.body.newAuthor;
    let response = await addNewAuthor(newAuthor);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function updateAuthorById(newAuthorData, id) {
  let authorDetails = await author.findOne({ where: { id } });

  if (!authorDetails) {
    return {};
  }

  authorDetails.set(newAuthorData);
  let updatedData = await authorDetails.save();

  return { message: 'Author updated successfully', updatedData };
}

app.post('/authors/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newAuthorData = req.body;
    let response = await updateAuthorById(newAuthorData, id);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PORT
app.listen(3000, () => {
  console.log('Server is running on Port 3000');
});
