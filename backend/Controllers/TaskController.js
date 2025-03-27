const TaskModel = require("../Models/TaskModel");

const createTask = async (req, res) => {
  const data = req.body;
  try {
    const model = new TaskModel(data);
    await model.save();
    res.status(201).json({ message: "Task is created", success: true }); // ✅ Fixed success
  } catch (err) {
    res.status(500).json({ message: "Failed to create Task", success: false });
  }
};

const fetchAllTasks = async (req, res) => {
  try {

    const data = await TaskModel.find({});
    res.status(200).json({ message: "All Tasks", success: true, data }); // ✅ Fixed status code
  } catch (err) {
    res.status(500).json({ message: "Failed to get all Tasks", success: false });
  }
};
const updateTaskById = async (req, res) => {
  try {
        const id = req.params.id;
        const body = req.body;
        const obj = { $set: { ...body } };
     await TaskModel.findByIdAndUpdate(id, obj)
    res.status(200).json({ message: "Task Updated", success: true }); // ✅ Fixed status code
  } catch (err) {
    res.status(500).json({ message: "Failed to update Tasks", success: false });
  }
};
const deleteTaskById = async (req, res) => {
  try {
     const id = req.params.id;
       
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Tasks is deleted", success: true }); // ✅ Fixed status code
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Tasks", success: false });
  }
};

module.exports = {
  createTask,
  fetchAllTasks,
  updateTaskById,
  deleteTaskById
};
