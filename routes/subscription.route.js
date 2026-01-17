import { Router } from 'express';
import { 
    cancelSubscriptionById, 
    createSubscription, 
    deleteSubscriptionById, 
    getAllSubscriptions, 
    getSubscriptionById, 
    getUpcomingRenewals, 
    getUserSubscriptions, 
    renewSubscriptionById, 
    updateSubscriptionById 
} from '../controllers/subscription.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authMiddleware, getAllSubscriptions);
subscriptionRouter.get('/:id', authMiddleware, getSubscriptionById);
subscriptionRouter.post('/', authMiddleware, createSubscription)
subscriptionRouter.put('/:id', authMiddleware, updateSubscriptionById);
subscriptionRouter.delete('/:id', authMiddleware, deleteSubscriptionById);
subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', authMiddleware, cancelSubscriptionById);
subscriptionRouter.get('/upcoming-renewals', authMiddleware, getUpcomingRenewals);
subscriptionRouter.patch("/renew/:id", authMiddleware, renewSubscriptionById);

export default subscriptionRouter;