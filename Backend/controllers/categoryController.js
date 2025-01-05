const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
      const { categoryName } = req.body; // Extract the categoryName from the request body
      if(!categoryName){
        return res.status(400).send({error: 'Category name is required.'});
      }
      // Create a new category
      const category = new Category({ name: categoryName });
      // Save the category to the database
      await category.save();

      // Send a success response to the client
      res.status(201).json({ message: 'Category created successfully.' , categoryID: category._id});
    } catch (error) {
      console.error("Error creating category: ", error);
      res.status(500).send({ error: 'An error occurred while creating the category.' }); // the difference between send and json is that json will send the response as a json object while send will send the response as a string
    }
  };
  
  exports.getCategoryTopics = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const category = await Category.findById(categoryId).populate('topics');
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }
  
      res.status(200).json({ topics: category.topics });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching topics.' });
    }
  };