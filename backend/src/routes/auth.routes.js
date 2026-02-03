import {Router} from 'express';
import {loginUser, logoutUser, refreshUser, registerUser} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.post('/refresh', refreshUser);
router.post('/logout', logoutUser);

export default router;