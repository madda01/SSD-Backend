let Post = require('../models/post')

//create new group
// export function addNewPost(req, res) {
//   const userId = req.body.userId
//   const groupId = req.body.groupId
//   const contentText = req.body.contentText
//   const images = req.body.images
//   const comments = req.body.comments
//   const userName = req.body.userName
//   const photoUrl = req.body.photoUrl

//   const newPost = new Post({
//     userId,
//     groupId,
//     contentText,
//     images,
//     comments,
//     userName,
//     photoUrl,
//   })
//   console.log(newPost)

//   newPost
//     .save()
//     .then(() => {
//       res.json('Post Created')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

const postService = require('../services/post')

function sanitizeInput(input) {
  // Remove leading/trailing white spaces and escape HTML characters
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function addNewPost(req, res) {
  const postData = {
    userId: sanitizeInput(req.body.userId),
    groupId: sanitizeInput(req.body.groupId),
    contentText: sanitizeInput(req.body.contentText),
    images: req.body.images, // No need to sanitize images
    comments: req.body.comments, // No need to sanitize comments
    userName: sanitizeInput(req.body.userName),
    photoUrl: sanitizeInput(req.body.photoUrl),
  }

  postService
    .addNewPost(postData)
    .then((response) => {
      console.log(response)
      res.json('Post Created')
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

// export function getUserPosts(req, res) {
//   const userId = req.params.userId
//   console.log(userId)
//   Post.find({ userId: userId })
//     .sort({ timePosted: -1 })
//     .limit(20)
//     .then((posts) => {
//       res.json(posts)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

export function getUserPosts(req, res) {
  const userId = req.params.userId

  postService
    .getUserPosts(userId)
    .then((posts) => {
      res.json(posts)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

//fetch all posts of a group
// export function getGroupPosts(req, res) {
//   const groupId = req.params.groupId

//   Post.find({ groupId: groupId })
//     .sort({ timePosted: -1 })
//     .limit(20)
//     .then((posts) => {
//       res.json(posts)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

export function getGroupPosts(req, res) {
  const groupId = req.params.groupId

  postService
    .getGroupPosts(groupId)
    .then((posts) => {
      res.json(posts)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

//fetch all posts of a group for feed
// export function getFeedPosts(req, res) {
//   Post.find()
//     .sort({ timePosted: -1 })
//     .limit(20)
//     .then((posts) => {
//       res.json(posts)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

export function getFeedPosts(req, res) {
  postService
    .getFeedPosts()
    .then((posts) => {
      res.json(posts)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

//update post by id
// export function updatePost(req, res) {
//   const postId = req.params.postId
//   const updatedPost = req.body
//   Post.findByIdAndUpdate(postId, updatedPost, { new: true })
//     .sort({ timePosted: -1 })
//     .then((post) => {
//       res.json(post)
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

export function updatePost(req, res) {
  const postId = req.params.postId
  const updatedPost = req.body

  postService
    .updatePost(postId, updatedPost)
    .then((post) => {
      res.json(post)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

//delete psost by id
// export function deletePost(req, res) {
//   let _id = req.params.postId

//   console.log(_id)
//   Post.findOneAndDelete({ _id })
//     .then(() => {
//       console.log('deleted 1')
//       res.json('deleted!')
//       console.log('deleted 2')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

export function deletePost(req, res) {
  const postId = req.params.postId

  postService
    .deletePost(postId)
    .then(() => {
      console.log('deleted 1')
      res.json('Deleted!')
      console.log('deleted 2')
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('An error occurred')
    })
}

// export async function searchPostsByContent(req, res) {
//   const searchValue = req.query.searchValue.toString()
//   const findObj = req.query.tempSearchObj || {}
//   let posts

//   // Define the search pipeline
//   if (searchValue === undefined || searchValue === null || searchValue === '') {
//     posts = await Post.find({ ...findObj })
//     return res.json(posts)
//   } else {
//     try {
//       posts = await Post.find({ $text: { $search: searchValue }, ...findObj }).sort({
//         score: { $meta: 'textScore' },
//       })
//       return res.json(posts)
//     } catch (error) {
//       console.error(error)
//       return res.status(500).send('Internal Server Error')
//     }
//   }
// }

export async function searchPostsByContent(req, res) {
  const searchValue = req.query.searchValue.toString()
  const findObj = req.query.tempSearchObj || {}

  try {
    const posts = await postService.searchPostsByContent(searchValue, findObj)
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}
