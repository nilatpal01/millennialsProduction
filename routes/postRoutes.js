const express = require('express');

const postController = require('../controllers/postController');

const router = express.Router();

router
  .route('/sciAndTech')
  .get(postController.getSciAndTech, postController.getallPost);

router
  .route('/sports')
  .get(postController.getSports, postController.getallPost);

router
  .route('/filmsAndSeries')
  .get(postController.getFilmsAndSeries, postController.getallPost);

router
  .route('/startUp')
  .get(postController.getStartUp, postController.getallPost);

router
  .route('/foodAndTravel')
  .get(postController.getFoodAndTravel, postController.getallPost);

router
  .route('/womensStory')
  .get(postController.getWomensStory, postController.getallPost);

router.route('/LGBTQ').get(postController.getLGBTQ, postController.getallPost);

router
  .route('/funAndHumours')
  .get(postController.getFunAnHumours, postController.getallPost);

router
  .route('/barakValley')
  .get(postController.getBarakValley, postController.getallPost);

router
  .route('/allpost')
  .get(postController.getallPost)
  .post(postController.fun1)

router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;