let Group = require('../models/group')
const group = require('../services/group')

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function addNewGroup(req, res) {
  // Sanitize user inputs
   const groupName = sanitizeInput(req.body.groupName);
   const description = sanitizeInput(req.body.description);
   const category = sanitizeInput(req.body.category);
   const groupIcon = sanitizeInput(req.body.groupIcon);
   const adminId = sanitizeInput(req.body.adminId);
   const followersUserId = req.body.followersUserId; // Assuming it's an array

  group
    .addNewGroup(groupName, description, category, groupIcon, adminId, followersUserId)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to create a group')
    })
}

function getAllGroups(req, res) {
  group
    .getAllGroups()
    .then((groups) => {
      res.json(groups)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get groups');
    })
}

function updateGroup(req, res, next) {
  const groupId = req.params._id
  const updatedGroupData = req.body

  group
    .updateGroup(groupId, updatedGroupData)
    .then((updatedGroup) => {
      res.json(updatedGroup)
      console.log('Group updated successfully!')
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to update group')
    })
}

function getOneGroup(req, res) {
  const groupId = req.params._id

  group
    .getOneGroup(groupId)
    .then((group) => {
      res.json(group)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get group')
    })
}

function deleteGroup(req, res) {
  const groupId = req.params._id

  group
    .deleteGroup(groupId)
    .then((message) => {
      res.json(message)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to delete group')
    })
}

function addFollows(req, res) {
  const groupId = req.params._id
  const followers = req.body.followersUserId

  group
    .addFollows(groupId, followers)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to add followers to group')
    })
}

// async function removeFollows(req, res) {
//   try {
//     const groupId = req.params._id
//     const followerId = req.body.followerId
//     const group = await groupService.removeFollows(groupId, followerId)
//     res.json(group)
//     console.log('group updated successfully !')
//   } catch (err) {
//     console.log(err.message)
//   }
// }

function getGroupsByUserId(req, res) {
  const adminId = req.params.adminId

  group
    .getGroupsByUserId(adminId)
    .then((group) => {
      res.json(group)
    })
    .catch((err) => {
      console.log(err.message)
      res.status(500).send('Error retrieving group')
    })
}

//remove followersUserId when click leave button
export function removeFollows(req, res) {
  Group.findByIdAndUpdate(
    req.params._id,
    { $pull: { followersUserId: req.body.followersUserId } },
    (error, data) => {
      if (error) {
        console.log('group not found')
      } else {
        res.json(data)
        console.log('group updated successfully !')
      }
    },
  )
}

module.exports = {
  addNewGroup,
  getAllGroups,
  updateGroup,
  getOneGroup,
  deleteGroup,
  addFollows,
  removeFollows,
  getGroupsByUserId,
}
