const path = require('path');
const multer = require('multer');

const tmpFolder = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const { id } = request.params;
      const fileName = `${id}.jpeg`;

      return callback(null, fileName);
    },
  }),
};
