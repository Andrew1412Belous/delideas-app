const User = require('../models/User')
const config = require('config')
const Uuid = require('uuid')

class FileController {
  async uploadAvatar (req, res) {
    try {
      const file = req.files.file
      const id = req.user.id

      const user = await User.findById(id)

      const avatarName = Uuid.v4() + ".jpg"
      file.mv(config.get('staticPath') + "\\" + avatarName)
      user.avatar = avatarName

      await user.save()

      return res.json(user)
    } catch (e) {
      console.log(e)
      return res.status(400).json({message: 'Upload avatar error'})
    }
  }
}

module.exports = new FileController()


