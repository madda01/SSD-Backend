const Group = require('../models/group')

//The $merge stage combines the result of the aggregation pipeline with existing documents in the collection
function addNewGroup(groupName, description, category, groupIcon, adminId, followersUserId) {
  return Group.aggregate([
    {
      $merge: {
        into: 'groups',
        whenMatched: 'merge',
        whenNotMatched: 'insert',
        on: '_id',
        new: {
          groupName,
          description,
          category,
          groupIcon,
          adminId,
          followersUserId,
        },
      },
    },
  ])
}

function getAllGroups() {
  return Group.find()
}

// function updateGroup(groupId, updatedGroupData) {
//   return Group.findByIdAndUpdate(groupId, updatedGroupData)
// }
function updateGroup(groupId, updatedGroupData) {
  return Group.aggregate([
    { $match: { _id: groupId } },
    {
      $set: updatedGroupData,
    },
  ])
}
//use the $set stage to update the document fields. 
//The $set stage replaces the value of a field with the specified value


function getOneGroup(groupId) {
  return Group.findById(groupId)
}

function deleteGroup(groupId) {
  return Group.findByIdAndDelete(groupId)
}

// function addFollows(groupId, followers) {
//   return Group.findByIdAndUpdate(groupId, { $set: { followersUserId: followers } }, { new: true })
// }
function addFollows(groupId, followers) {
  return Group.aggregate([
    { $match: { _id: groupId } },
    {
      $addToSet: { followersUserId: { $each: followers } },
    },
  ])
}
//use the $addToSet stage to add unique follower IDs to the followersUserId array

// async function removeFollows(groupId, followerId) {
//   try {
//     const group = await Group.findByIdAndUpdate(
//       groupId,
//       { $pull: { followersUserId: followerId } },
//       { new: true }, // to return the updated document
//     )
//     return group
//   } catch (err) {
//     throw err
//   }
// }
async function removeFollows(groupId, followerId) {
  try {
    const group = await Group.aggregate([
      { $match: { _id: groupId } },
      {
        $pull: { followersUserId: followerId },
      },
    ])
    return group
  } catch (err) {
    throw err
  }
}
//use the $pull stage to remove the follower ID from the followersUserId array

function findByAdminId(adminId) {
  return Group.findOne({ adminId }).exec()
}

module.exports = {
  addNewGroup,
  getAllGroups,
  updateGroup,
  getOneGroup,
  deleteGroup,
  addFollows,
  removeFollows,
  findByAdminId,
}
